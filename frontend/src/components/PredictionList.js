import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

export function PredictionList({ predictions = [] }) {
  if (!predictions.length) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {predictions.map((item) => {
        const percent = Math.round(item.confidence * 100);

        return (
          <View key={item.label} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.percent}>{percent}%</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${percent}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
    marginTop: 10,
  },
  row: {
    gap: 7,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 14,
  },
  percent: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 14,
  },
  track: {
    height: 9,
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
