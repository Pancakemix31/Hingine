import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { cars } from "@/data/cars";
import { useAppContext } from "@/context/AppContext";

const ProfileScreen = () => {
  const { state, updateProfile, toggleSavedCar } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editableBudget, setEditableBudget] = useState(state.profile.monthlyBudget.toString());
  const [editableCredit, setEditableCredit] = useState(state.profile.creditScoreEstimate.toString());

  const savedCars = useMemo(() => cars.filter((car) => state.savedCars.includes(car.id)), [state.savedCars]);
  const swipeSummary = useMemo(
    () => ({
      likes: state.swipeHistory.filter((entry) => entry.decision === "like").length,
      passes: state.swipeHistory.filter((entry) => entry.decision === "skip").length
    }),
    [state.swipeHistory]
  );

  const handleSave = () => {
    const budget = parseInt(editableBudget, 10);
    const credit = parseInt(editableCredit, 10);
    updateProfile({
      monthlyBudget: Number.isNaN(budget) ? state.profile.monthlyBudget : budget,
      creditScoreEstimate: Number.isNaN(credit) ? state.profile.creditScoreEstimate : credit
    });
    setIsEditing(false);
  };

  return (
    <FlatList
      style={styles.screen}
      data={savedCars}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Your Toyota Playbook</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View>
                <Text style={styles.profileName}>{state.profile.name}</Text>
                <Text style={styles.profileMeta}>
                  {state.profile.age} • {state.profile.major} @ {state.profile.school}
                </Text>
                <Text style={styles.profileMeta}>Graduation {state.profile.graduationYear}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setIsEditing((prev) => !prev);
                  setEditableBudget(state.profile.monthlyBudget.toString());
                  setEditableCredit(state.profile.creditScoreEstimate.toString());
                }}
              >
                <Text style={styles.editButtonText}>{isEditing ? "Cancel" : "Edit"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{state.profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{state.profile.phone}</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Toyota ID</Text>
              <Text style={styles.infoValue}>STU-{state.profile.graduationYear}</Text>
            </View>
          </View>

          <View style={styles.financialCard}>
            <View style={styles.financialHeader}>
              <Text style={styles.financialTitle}>Financial Snapshot</Text>
              {isEditing ? (
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Monthly comfort zone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.inlineInput}
                  keyboardType="numeric"
                  value={editableBudget}
                  onChangeText={setEditableBudget}
                />
              ) : (
                <Text style={styles.financialValue}>${state.profile.monthlyBudget}</Text>
              )}
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Credit score estimate</Text>
              {isEditing ? (
                <TextInput
                  style={styles.inlineInput}
                  keyboardType="numeric"
                  value={editableCredit}
                  onChangeText={setEditableCredit}
                />
              ) : (
                <Text style={styles.financialValue}>{state.profile.creditScoreEstimate}</Text>
              )}
            </View>
            <View style={styles.financialSummary}>
              <View>
                <Text style={styles.summaryValue}>{swipeSummary.likes}</Text>
                <Text style={styles.summaryLabel}>Matches</Text>
              </View>
              <View>
                <Text style={styles.summaryValue}>{swipeSummary.passes}</Text>
                <Text style={styles.summaryLabel}>Skips</Text>
              </View>
              <View>
                <Text style={styles.summaryValue}>{state.completedLessons.length}</Text>
                <Text style={styles.summaryLabel}>Lessons completed</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Saved rides</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.savedCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.savedTitle}>{item.name}</Text>
            <Text style={styles.savedSubtitle}>{item.trim}</Text>
            <Text style={styles.savedDetail}>${item.monthlyFinance}/mo finance • {item.mpg}</Text>
            <Text style={styles.savedMatch}>{item.matchScore}% match score</Text>
          </View>
          <TouchableOpacity style={styles.removeSaveButton} onPress={() => toggleSavedCar(item.id)}>
            <Text style={styles.removeSaveText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyState}>
          Swipe right on a Toyota to pin it here. Your favorites follow you into Offers and Goals.
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
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16
  },
  header: {
    gap: 18
  },
  pageTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 24,
    color: "#111f34"
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  profileName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#111f34"
  },
  profileMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b"
  },
  editButton: {
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start"
  },
  editButtonText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1d2f73"
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  infoRowLast: {
    marginBottom: 0
  },
  infoLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#5d6b7e"
  },
  infoValue: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#111f34"
  },
  financialCard: {
    backgroundColor: "#111f34",
    borderRadius: 24,
    padding: 22,
    gap: 12
  },
  financialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  financialTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#fff"
  },
  saveButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },
  saveButtonText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#111f34"
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  financialLabel: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#b8c6ff"
  },
  financialValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#fff"
  },
  inlineInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 90,
    textAlign: "center",
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#111f34"
  },
  financialSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8
  },
  summaryValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#fff",
    textAlign: "center"
  },
  summaryLabel: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#b8c6ff",
    textAlign: "center"
  },
  sectionLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#111f34"
  },
  savedCard: {
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
  savedTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#111f34"
  },
  savedSubtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b"
  },
  savedDetail: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#5d6b7e"
  },
  savedMatch: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#ef2b2d",
    marginTop: 4
  },
  removeSaveButton: {
    backgroundColor: "#ffe9ec",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  removeSaveText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#ef2b2d"
  },
  emptyState: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b",
    textAlign: "center",
    paddingVertical: 40
  }
});

export default ProfileScreen;

