import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ActionButton } from "./src/components/ActionButton";
import { PredictionList } from "./src/components/PredictionList";
import { colors } from "./src/theme/colors";

const defaultApiUrl = Platform.select({
  android: "http://10.0.2.2:8000",
  ios: "http://localhost:8000",
  default: "http://localhost:8000",
});

export default function App() {
  const [apiUrl, setApiUrl] = useState(defaultApiUrl);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cleanApiUrl = useMemo(() => apiUrl.replace(/\/+$/, ""), [apiUrl]);

  async function pickImage(source) {
    setError("");
    setResult(null);

    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Izin diperlukan", "Aplikasi membutuhkan izin untuk memilih gambar.");
      return;
    }

    const picker =
      source === "camera" ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

    const response = await picker({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!response.canceled && response.assets?.[0]) {
      setImage(response.assets[0]);
    }
  }

  async function classifyImage() {
    if (!image) {
      Alert.alert("Pilih gambar", "Ambil atau pilih gambar terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const filename = image.uri.split("/").pop() || "image.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      const data = new FormData();
      data.append("file", {
        uri: image.uri,
        name: filename,
        type: mimeType,
      });

      const response = await fetch(`${cleanApiUrl}/predict`, {
        method: "POST",
        body: data,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || "Backend gagal memproses gambar.");
      }

      setResult(payload);
    } catch (err) {
      setError(err.message || "Gagal menghubungi backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="scan" size={26} color="#ffffff" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>RupiahVision</Text>
              <Text style={styles.subtitle}>Frontend React Native dan backend klasifikasi gambar.</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Backend API</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={setApiUrl}
              placeholder="http://localhost:8000"
              style={styles.input}
              value={apiUrl}
            />
          </View>

          <View style={styles.imageFrame}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.preview} />
            ) : (
              <View style={styles.emptyPreview}>
                <Ionicons name="image-outline" size={56} color={colors.muted} />
                <Text style={styles.emptyTitle}>Belum ada gambar</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <ActionButton icon="camera" label="Kamera" onPress={() => pickImage("camera")} />
            <ActionButton
              icon="images"
              label="Galeri"
              onPress={() => pickImage("library")}
              variant="secondary"
            />
          </View>

          <ActionButton
            disabled={loading || !image}
            icon="sparkles"
            label={loading ? "Mengklasifikasi..." : "Klasifikasi Gambar"}
            onPress={classifyImage}
          />

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
            <View style={styles.resultPanel}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultEyebrow}>Prediksi utama</Text>
                  <Text style={styles.resultLabel}>{result.label}</Text>
                </View>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidenceText}>
                    {Math.round(result.confidence * 100)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                Resolusi gambar: {result.image_width} x {result.image_height}
              </Text>
              <PredictionList predictions={result.predictions} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 8,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.ink,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  panel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.ink,
    backgroundColor: "#fbfaf7",
  },
  imageFrame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  emptyPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyTitle: {
    color: colors.muted,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  loading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  loadingText: {
    color: colors.muted,
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
  errorText: {
    flex: 1,
    color: colors.danger,
    fontWeight: "700",
  },
  resultPanel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 10,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  resultEyebrow: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  resultLabel: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 3,
  },
  confidencePill: {
    minWidth: 66,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#dcfce7",
  },
  confidenceText: {
    color: colors.success,
    fontWeight: "900",
    fontSize: 16,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
});
