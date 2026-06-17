const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function addFmtFixToPodfile(contents) {
  if (contents.includes("# Fix fmt consteval error on Xcode 26.4+")) {
    return contents;
  }

  const patch = `
  # Fix fmt consteval error on Xcode 26.4+
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
  end

  # Force-disable fmt consteval for Apple Clang / Xcode 26.4+
  fmt_base = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')

  if File.exist?(fmt_base)
    content = File.read(fmt_base)

    patched = content.gsub(
      /^#\\s*define FMT_USE_CONSTEVAL 1$/,
      '# define FMT_USE_CONSTEVAL 0'
    )

    if patched != content
      File.chmod(0644, fmt_base)
      File.write(fmt_base, patched)
    end
  end
`;

  // Sisipkan sebelum akhir post_install do |installer| ... end
  return contents.replace(
    /post_install do \|installer\|([\s\S]*?)^\s*end/m,
    (match, body) => {
      return `post_install do |installer|${body}${patch}\nend`;
    }
  );
}

module.exports = function withFmtXcodeFix(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");

      if (!fs.existsSync(podfilePath)) {
        throw new Error(`Podfile not found at ${podfilePath}`);
      }

      const contents = fs.readFileSync(podfilePath, "utf8");
      const updated = addFmtFixToPodfile(contents);

      fs.writeFileSync(podfilePath, updated);

      return config;
    },
  ]);
};