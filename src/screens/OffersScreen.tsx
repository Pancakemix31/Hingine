import { FlatList, StyleSheet, Text, View } from "react-native";

import ProgressBar from "@/components/ProgressBar";
import { offers } from "@/data/offers";
import { useAppContext } from "@/context/AppContext";

const OffersScreen = () => {
  const {
    state: { points, level }
  } = useAppContext();

  const unlockedCount = offers.filter((offer) => points >= offer.pointsRequired).length;
  const nextOffer = offers.find((offer) => points < offer.pointsRequired);
  const previousThreshold = nextOffer
    ? offers
        .filter((offer) => offer.pointsRequired < nextOffer.pointsRequired)
        .reduce((acc, offer) => Math.max(acc, offer.pointsRequired), 0)
    : offers[offers.length - 1]?.pointsRequired ?? 0;
  const nextTarget = nextOffer ? Math.max(0, nextOffer.pointsRequired - points) : 0;
  const progressToNext = nextOffer
    ? Math.min(
        1,
        (points - previousThreshold) / (nextOffer.pointsRequired - previousThreshold || 1)
      )
    : 1;

  return (
    <View style={styles.screen}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Rewards Wallet</Text>
        <Text style={styles.summaryPoints}>{points} pts</Text>
        <Text style={styles.summaryLevel}>Level {level}</Text>
        {nextOffer ? (
          <View style={styles.nextTargetBox}>
            <Text style={styles.nextTargetText}>
              {nextOffer.pointsRequired} pts unlocks: {nextOffer.title}
            </Text>
            <ProgressBar progress={progressToNext} />
            <Text style={styles.nextTargetSubtext}>
              {nextTarget} pts to go. Knock out a quiz or match a vehicle to stay on track.
            </Text>
          </View>
        ) : (
          <Text style={styles.nextTargetComplete}>
            You’ve unlocked every incentive! Keep learning to maintain your elite status.
          </Text>
        )}
      </View>

      <Text style={styles.sectionLabel}>Incentives Earned ({unlockedCount}/{offers.length})</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.offerList}
        renderItem={({ item }) => {
          const unlocked = points >= item.pointsRequired;
          return (
            <View style={[styles.offerCard, unlocked ? styles.unlockedCard : styles.lockedCard]}>
              <View style={styles.offerHeader}>
                <Text style={styles.offerTitle}>{item.title}</Text>
                <View style={[styles.statusPill, unlocked ? styles.unlockedPill : styles.lockedPill]}>
                  <Text style={styles.statusPillText}>{unlocked ? "Unlocked" : `${item.pointsRequired} pts`}</Text>
                </View>
              </View>
              <Text style={styles.offerDescription}>{item.description}</Text>
              <View style={styles.perkTag}>
                <Text style={styles.perkText}>{item.perk}</Text>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    paddingTop: 48
  },
  summaryCard: {
    backgroundColor: "#101d35",
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 24,
    marginBottom: 20
  },
  summaryLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    textTransform: "uppercase",
    color: "#8fa5ff"
  },
  summaryPoints: {
    fontFamily: "Manrope_700Bold",
    fontSize: 36,
    color: "#ffffff",
    marginTop: 6
  },
  summaryLevel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 16,
    color: "#b8c6ff",
    marginBottom: 16
  },
  nextTargetBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    gap: 10
  },
  nextTargetText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#ffffff"
  },
  nextTargetSubtext: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#d8ddff"
  },
  nextTargetComplete: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#b8c6ff"
  },
  sectionLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#21304b",
    marginHorizontal: 20,
    marginBottom: 12
  },
  offerList: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  offerCard: {
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  unlockedCard: {
    backgroundColor: "#ffffff"
  },
  lockedCard: {
    backgroundColor: "#e8ecf6"
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  offerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#111f34"
  },
  offerDescription: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#44556c",
    lineHeight: 20,
    marginBottom: 14
  },
  perkTag: {
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  perkText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1d2f73"
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999
  },
  unlockedPill: {
    backgroundColor: "#e3f9e5"
  },
  lockedPill: {
    backgroundColor: "#dbe3f4"
  },
  statusPillText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#1d2f73"
  }
});

export default OffersScreen;

