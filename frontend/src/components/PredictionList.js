import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { formatPredictionLabel } from "../utils/labels";

export function PredictionList({ predictions = [] }) {
  if (!predictions.length) {
    return null;
  }

  const sortedPredictions = [...predictions].sort(
    (first, second) => second.confidence - first.confidence
  );

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Ionicons name="bar-chart" size={22} color={colors.primaryDark} />
        <Text style={styles.title}>Prediksi Teratas</Text>
      </View>

      <View style={styles.list}>
        {sortedPredictions.map((item, index) => {
          const percent = Math.round(item.confidence * 100);
          const isTop = index === 0;

          return (
            <View key={item.label} style={styles.row}>
              <Text style={[styles.label, isTop && styles.topLabel]}>
                {formatPredictionLabel(item.label)}
              </Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` }]} />
              </View>
              <Text style={[styles.percent, isTop && styles.topPercent]}>{percent}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 24,
    marginBottom: 0,
    gap: 14,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  title: {
    color: colors.ink,
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "800",
  },
  list: {
    gap: 9,
    paddingBottom: 8,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 28,
    paddingVertical: 2,
  },
  label: {
    color: colors.ink,
    fontFamily: "Roboto",
    width: 116,
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 20,
  },
  percent: {
    width: 38,
    color: colors.ink,
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "right",
  },
  topPercent: {
    color: colors.primary,
    fontWeight: "900",
  },
  topLabel: {
    color: colors.primaryDark,
    fontWeight: "900",
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.track,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
