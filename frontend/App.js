import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ActionButton } from "./src/components/ActionButton";
import { BanknoteInsightCard } from "./src/components/BanknoteInsightCard";
import { PredictionList } from "./src/components/PredictionList";
import { colors } from "./src/theme/colors";
import { formatPredictionLabel } from "./src/utils/labels";

const backendApiUrl = "https://rupiahvision.onrender.com";
const requestTimeoutMs = 45000;

function getFileName(asset) {
  if (asset.fileName) {
    return asset.fileName;
  }

  const uriName = asset.uri?.split("/").pop();
  return uriName && uriName.includes(".") ? uriName : `rupiahvision-${Date.now()}.jpg`;
}

function getMimeType(asset, fileName) {
  if (asset.mimeType) {
    return asset.mimeType;
  }

  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "png") {
    return "image/png";
  }
  if (ext === "webp") {
    return "image/webp";
  }

  return "image/jpeg";
}

function getUploadErrorMessage(err) {
  if (err?.name === "AbortError") {
    return "Backend terlalu lama merespons. Pastikan service Render sudah Live, lalu coba lagi.";
  }

  if (err?.message === "Network request failed") {
    return "Tidak bisa menghubungi backend RupiahVision. Pastikan koneksi internet aktif dan coba lagi.";
  }

  return err?.message || "Gagal menghubungi backend.";
}

function ResultMetrics({ result }) {
  const isBanknote = result.label !== "bukanuang";
  const nominal = isBanknote ? formatPredictionLabel(result.label) : "Tidak dikenali";
  const status = isBanknote ? "Uang kertas Indonesia" : "Bukan uang kertas";
  const confidence = `${Math.round(result.confidence * 100)}%`;

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeading}>
        <Ionicons name="document-text-outline" size={22} color={colors.primaryDark} />
        <Text style={styles.resultTitle}>Informasi Hasil</Text>
      </View>
      <MetricRow
        label="Nominal"
        value={nominal}
        valueStyle={styles.nominalValue}
      />
      <MetricRow
        label="Confidence"
        value={confidence}
        valueStyle={styles.confidenceValue}
      />
      <MetricRow
        label="Status"
        value={status}
        valueStyle={styles.statusValue}
        withDivider={false}
      />
    </View>
  );
}

function MetricRow({ icon, iconStyle, label, value, valueStyle, withDivider = true }) {
  return (
    <View style={[styles.metricRow, withDivider && styles.metricDivider]}>
      {icon && <View style={[styles.metricIcon, iconStyle]}>{icon}</View>}
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, valueStyle]}>{value}</Text>
    </View>
  );
}

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  async function pickImage(source) {
    setError("");
    setResult(null);

    try {
      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Izin diperlukan", "Aplikasi membutuhkan izin kamera.");
          return;
        }
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted && !permission.canAskAgain) {
          Alert.alert("Izin diperlukan", "Aktifkan izin foto/galeri dari pengaturan aplikasi.");
          return;
        }
      }

      const picker =
        source === "camera" ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

      const response = await picker({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: false,
        selectionLimit: 1,
        legacy: source !== "camera",
      });

      if (!response.canceled && response.assets?.[0]) {
        const asset = response.assets[0];
        const fileName = getFileName(asset);
        const selectedImage = {
          ...asset,
          fileName,
          mimeType: getMimeType(asset, fileName),
        };

        setImage(selectedImage);
        await classifyImage(selectedImage);
      }
    } catch (err) {
      setError(err?.message || "Gagal membuka gambar. Coba pilih gambar lain dari Galeri.");
    }
  }

  async function classifyImage(selectedImage = image) {
    if (!selectedImage) {
      Alert.alert("Pilih gambar", "Ambil atau pilih gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);
      const fileName = getFileName(selectedImage);
      const mimeType = getMimeType(selectedImage, fileName);

      const data = new FormData();
      data.append("file", {
        uri: selectedImage.uri,
        name: fileName,
        type: mimeType,
      });

      const response = await fetch(`${backendApiUrl}/predict`, {
        method: "POST",
        body: data,
        signal: controller.signal,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || "Backend gagal memproses gambar.");
      }

      setResult(payload);
      setActiveTab(0);
    } catch (err) {
      setError(getUploadErrorMessage(err));
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require("./assets/logo-rupiahvision-horizontal.png")}
            style={styles.headerLogo}
          />
          <Text style={styles.subtitle}>
            AI-Based Indonesian Banknote Recognition for Museum Experience
          </Text>
        </View>

        <View style={styles.imageFrame}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.preview} />
          ) : (
            <View style={styles.emptyPreview}>
              <Ionicons name="image-outline" size={56} color={colors.placeholder} />
              <Text style={styles.emptyTitle}>Belum ada gambar</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <ActionButton
            disabled={loading}
            icon={image ? "camera-reverse-outline" : "camera"}
            label={image ? "Foto Ulang" : "Kamera"}
            onPress={() => pickImage("camera")}
          />
          <ActionButton
            disabled={loading}
            icon="images"
            label={image ? "Ganti Gambar" : "Galeri"}
            onPress={() => pickImage("library")}
            variant="secondary"
          />
        </View>

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Memproses gambar di backend...</Text>
          </View>
        )}

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.tabContainer}>
            <View style={styles.tabBar}>
              {["Hasil", "Prediksi", "Histori"].map((tab, i) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(i)}
                  style={[styles.tabItem, activeTab === i && styles.tabItemActive]}
                >
                  <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.tabContent}>
              {activeTab === 0 && <ResultMetrics result={result} />}
              {activeTab === 1 && <PredictionList predictions={result.predictions} />}
              {activeTab === 2 && <BanknoteInsightCard label={result.label} />}
            </View>
          </View>
        )}

        <View style={styles.copyrightRow}>
          <Text style={styles.copyright}>© Copyright RupiahVision - 2026  •  </Text>
          <Pressable onPress={() => Linking.openURL("https://github.com/RupiahVision/")}>
            <Text style={styles.copyrightLink}>GitHub</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 88,
    gap: 14,
  },
  header: {
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 0,
  },
  headerLogo: {
    width: "90%",
    maxWidth: 356,
    height: 84,
    resizeMode: "contain",
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    fontFamily: "Roboto",
    fontSize: 17,
    lineHeight: 23,
    maxWidth: 310,
    textAlign: "center",
  },
  imageFrame: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyTitle: {
    color: colors.placeholder,
    fontFamily: "Roboto",
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 14,
  },
  loading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  loadingText: {
    color: colors.muted,
    fontFamily: "Roboto",
    fontWeight: "600",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fff1f2",
  },
  copyrightRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  copyright: {
    color: colors.muted,
    fontFamily: "Roboto",
    fontSize: 12,
  },
  copyrightLink: {
    color: colors.primary,
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "700",
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontFamily: "Roboto",
    fontWeight: "700",
  },
  tabContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    color: colors.muted,
    fontFamily: "Roboto",
    fontWeight: "600",
    fontSize: 14,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  tabContent: {
    padding: 14,
  },
  resultCard: {
    gap: 0,
  },
  resultHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  resultTitle: {
    color: colors.ink,
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "700",
  },
  metricRow: {
    minHeight: 58,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  metricDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.track,
  },
  metricIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  rupiahIcon: {
    borderRadius: 999,
    backgroundColor: colors.primaryDark,
  },
  rupiahIconText: {
    color: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 17,
    fontWeight: "700",
  },
  lineIcon: {
    backgroundColor: "transparent",
  },
  metricLabel: {
    width: 92,
    color: colors.ink,
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "600",
  },
  metricValue: {
    flex: 1,
    color: colors.primaryDark,
    fontFamily: "Roboto",
    fontWeight: "700",
    textAlign: "right",
  },
  nominalValue: {
    fontSize: 23,
    letterSpacing: 0,
  },
  confidenceValue: {
    fontSize: 23,
  },
  statusValue: {
    fontSize: 16,
  },
});
