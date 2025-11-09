import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { Car } from "@/data/cars";

type CarCardProps = {
  car: Car;
  matchLabel?: string;
};

const CarCard = ({ car, matchLabel }: CarCardProps) => (
  <View style={styles.card}>
    <Image source={{ uri: car.imageUrl }} style={styles.image} resizeMode="cover" />
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.title}>{car.name}</Text>
        <Text style={styles.subtitle}>{car.trim}</Text>
      </View>
      {matchLabel ? <Text style={styles.matchBadge}>{matchLabel}</Text> : null}
    </View>

    <Text style={styles.highlight}>{car.highlight}</Text>

    <View style={styles.metricsRow}>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Finance</Text>
        <Text style={styles.metricValue}>${car.monthlyFinance}/mo</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Lease</Text>
        <Text style={styles.metricValue}>${car.monthlyLease}/mo</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Efficiency</Text>
        <Text style={styles.metricValue}>{car.mpg}</Text>
      </View>
    </View>

    <View style={styles.tagRow}>
      {car.tags.map((tag) => (
        <View key={tag} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }
  },
  image: {
    width: "100%",
    height: 220
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0b1f3a"
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5a6b",
    marginTop: 2
  },
  matchBadge: {
    backgroundColor: "#0066ff",
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "600"
  },
  highlight: {
    paddingHorizontal: 20,
    color: "#1f2a44",
    fontSize: 15,
    marginBottom: 8
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  metric: {
    alignItems: "flex-start"
  },
  metricLabel: {
    fontSize: 12,
    color: "#6f7c8e",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0b1f3a",
    marginTop: 4
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  tag: {
    backgroundColor: "#e6f1ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  tagText: {
    fontSize: 12,
    color: "#1750aa",
    fontWeight: "600"
  }
});

export default memo(CarCard);

