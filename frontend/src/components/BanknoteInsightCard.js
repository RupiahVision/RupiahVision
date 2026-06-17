import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { getBanknoteDetail } from "../data/banknoteDetails";

export function BanknoteInsightCard({ label }) {
  const detail = getBanknoteDetail(label);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [label]);

  if (!detail) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Ionicons name="library-outline" size={21} color={colors.primaryDark} />
        <Text style={styles.title}>{detail.title}</Text>
      </View>

      <Text style={styles.previewText}>{detail.preview}</Text>

      <View style={styles.summaryBox}>
        {detail.summary.map((item) => (
          <View key={item.label} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={styles.summaryValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {expanded && (
        <>
          <View style={styles.sectionList}>
            {detail.sections.map((section) => (
              <View key={section.title} style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))}
          </View>

          <View style={styles.table}>
            {detail.rows.map((item, index) => (
              <View
                key={item.label}
                style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={styles.tableLabel}>{item.label}</Text>
                <Text style={styles.tableValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [styles.toggleButton, pressed && styles.togglePressed]}
      >
        <Text style={styles.toggleText}>{expanded ? "Sembunyikan" : "Selengkapnya"}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.primaryDark}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 14,
    marginBottom: 24,
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
    fontWeight: "900",
  },
  summaryBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  summaryRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.track,
    backgroundColor: "#fbfcfd",
  },
  summaryLabel: {
    color: colors.ink,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "800",
  },
  summaryValue: {
    flex: 1,
    marginLeft: 16,
    color: colors.primaryDark,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  previewText: {
    color: colors.muted,
    fontFamily: "Roboto",
    fontSize: 14,
    lineHeight: 22,
  },
  table: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 12,
    backgroundColor: colors.surface,
  },
  tableRowAlt: {
    backgroundColor: "#f6f8fa",
  },
  tableLabel: {
    width: 118,
    color: colors.ink,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  tableValue: {
    flex: 1,
    color: colors.muted,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  sectionList: {
    gap: 12,
  },
  sectionBlock: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fbfcfd",
    gap: 6,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "900",
  },
  sectionBody: {
    color: colors.muted,
    fontFamily: "Roboto",
    fontSize: 14,
    lineHeight: 22,
  },
  toggleButton: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.surface,
  },
  togglePressed: {
    opacity: 0.9,
  },
  toggleText: {
    color: colors.primaryDark,
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "800",
  },
});
