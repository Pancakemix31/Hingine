import { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { cars } from "@/data/cars";
import { useAppContext } from "@/context/AppContext";
import { calculateMatchScore, type ScoredCar } from "@/utils/match";

const GarageScreen = () => {
  const { state, toggleSavedCar } = useAppContext();

  const savedCars = useMemo<ScoredCar[]>(
    () =>
      cars
        .filter((car) => state.savedCars.includes(car.id))
        .map((car) => ({
          ...car,
          matchScore: calculateMatchScore({
            car,
            profile: state.profile,
            financialPreferences: state.financialPreferences
          })
        })),
    [state.financialPreferences, state.profile, state.savedCars]
  );

  return (
    <FlatList
      style={styles.screen}
      data={savedCars}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.pageLabel}>My Garage</Text>
          <Text style={styles.pageTitle}>Saved rides ready when you are.</Text>
          <Text style={styles.pageSubtitle}>
            Keep tabs on the Toyotas you liked. Compare trims, review payments, and clear out anything
            you no longer need.
          </Text>
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>Pinned rides</Text>
              <Text style={styles.summaryValue}>{savedCars.length}</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>New matches</Text>
              <Text style={styles.summaryValue}>{state.swipeHistory.filter((entry) => entry.decision === "like").length}</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Offers unlocked</Text>
              <Text style={styles.summaryValue}>{state.completedLessons.length}</Text>
            </View>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.trim}</Text>
            <Text style={styles.cardMeta}>${item.monthlyFinance}/mo finance • {item.mpg}</Text>
            <Text style={styles.cardMatch}>{item.matchScore}% match score</Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={() => toggleSavedCar(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyState}>
          You haven’t saved any Toyotas yet. Head to Match and swipe right to build your garage.
        </Text>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  listContent: {
    paddingBottom: 140,
    paddingHorizontal: 20,
    gap: 16
  },
  header: {
    paddingTop: 48,
    gap: 14
  },
  pageLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#8fa5ff",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  pageTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
    color: "#111f34"
  },
  pageSubtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b",
    lineHeight: 20
  },
  summaryCard: {
    backgroundColor: "#111f34",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryLabel: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#b8c6ff"
  },
  summaryValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#fff",
    marginTop: 6
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#111f34"
  },
  cardSubtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b"
  },
  cardMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#5d6b7e"
  },
  cardMatch: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#ef2b2d",
    marginTop: 4
  },
  removeButton: {
    backgroundColor: "#ffe9ec",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  removeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#ef2b2d"
  },
  emptyState: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b",
    textAlign: "center",
    paddingVertical: 60
  }
});

export default GarageScreen;
