import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import ProgressBar from "@/components/ProgressBar";
import { cars } from "@/data/cars";
import { type Goal, useAppContext } from "@/context/AppContext";

type GoalFormState = {
  title: string;
  targetVehicle: string;
  targetBudget: string;
  monthlyContribution: string;
  targetDate: string;
  notes: string;
};

const emptyForm: GoalFormState = {
  title: "",
  targetVehicle: "",
  targetBudget: "",
  monthlyContribution: "",
  targetDate: "",
  notes: ""
};

const GoalsScreen = () => {
  const { state, addGoal, deleteGoal } = useAppContext();
  const [form, setForm] = useState<GoalFormState>(emptyForm);

  const suggestedVehicles = useMemo(
    () =>
      cars
        .filter((car) => car.matchScore >= 80)
        .slice(0, 3)
        .map((car) => `${car.name} — ${car.trim}`),
    []
  );

  const handleSubmit = () => {
    if (!form.title.trim()) {
      Alert.alert("Goal name needed", "Give your goal a short, clear title.");
      return;
    }
    if (!form.targetBudget) {
      Alert.alert("Target amount", "Estimate how much you want to save.");
      return;
    }
    const targetBudget = parseFloat(form.targetBudget);
    const monthlyContribution = form.monthlyContribution ? parseFloat(form.monthlyContribution) : 0;

    addGoal({
      title: form.title.trim(),
      targetVehicle: form.targetVehicle.trim() || undefined,
      targetBudget: Number.isNaN(targetBudget) ? 0 : targetBudget,
      monthlyContribution: Number.isNaN(monthlyContribution) ? 0 : monthlyContribution,
      targetDate: form.targetDate.trim() || undefined,
      notes: form.notes.trim() || undefined
    });
    setForm(emptyForm);
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          {item.targetVehicle ? <Text style={styles.goalVehicle}>{item.targetVehicle}</Text> : null}
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteGoal(item.id)}>
          <Text style={styles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.goalMetaRow}>
        <Text style={styles.goalMetaLabel}>Target</Text>
        <Text style={styles.goalMetaValue}>${item.targetBudget.toLocaleString()}</Text>
      </View>
      <View style={styles.goalMetaRow}>
        <Text style={styles.goalMetaLabel}>Monthly plan</Text>
        <Text style={styles.goalMetaValue}>${item.monthlyContribution.toLocaleString()}</Text>
      </View>
      {item.targetDate ? (
        <View style={styles.goalMetaRow}>
          <Text style={styles.goalMetaLabel}>ETA</Text>
          <Text style={styles.goalMetaValue}>{item.targetDate}</Text>
        </View>
      ) : null}
      {item.notes ? <Text style={styles.goalNotes}>{item.notes}</Text> : null}
      <View style={styles.goalFooter}>
        <Text style={styles.goalFooterText}>
          Created {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        data={state.goals}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>Dream Garage Planner</Text>
              <Text style={styles.heroTitle}>Stack milestones, unlock your Toyota.</Text>
              <Text style={styles.heroCopy}>
                Map your savings journey, track progress, and align a car with your lifestyle goals.
              </Text>
              <ProgressBar progress={Math.min(1, state.goals.length / 3)} />
              <Text style={styles.heroFootnote}>
                Add {Math.max(0, 3 - state.goals.length)} more goals to complete your roadmap.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Add a new milestone</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Goal title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Example: Down payment fund"
                  value={form.title}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Toyota (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder={suggestedVehicles[0]}
                  value={form.targetVehicle}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, targetVehicle: text }))}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.rowItem]}>
                  <Text style={styles.inputLabel}>Target amount ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2500"
                    keyboardType="numeric"
                    value={form.targetBudget}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, targetBudget: text }))}
                  />
                </View>
                <View style={[styles.inputGroup, styles.rowItem]}>
                  <Text style={styles.inputLabel}>Monthly contribution ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="150"
                    keyboardType="numeric"
                    value={form.monthlyContribution}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, monthlyContribution: text }))}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Dec 2025"
                  value={form.targetDate}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, targetDate: text }))}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Scholarship arrives in August, plan to boost contributions then."
                  multiline
                  value={form.notes}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, notes: text }))}
                />
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitLabel}>Save milestone</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>Popular student-friendly picks</Text>
              {suggestedVehicles.map((vehicle) => (
                <Text key={vehicle} style={styles.suggestionItem}>
                  • {vehicle}
                </Text>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyState}>Add your first goal to start building your dream garage.</Text>
        }
        renderItem={renderGoal}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  listContent: {
    paddingBottom: 140
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    gap: 18
  },
  heroCard: {
    backgroundColor: "#111f34",
    borderRadius: 24,
    padding: 22,
    gap: 10
  },
  heroLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#8fa5ff",
    textTransform: "uppercase"
  },
  heroTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: "#fff"
  },
  heroCopy: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#d8ddff",
    lineHeight: 20
  },
  heroFootnote: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#b8c6ff"
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  formTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#111f34",
    marginBottom: 12
  },
  inputGroup: {
    marginBottom: 14
  },
  inputLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#4b5a6b",
    marginBottom: 6
  },
  input: {
    backgroundColor: "#f1f4fb",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: "#111f34"
  },
  notesInput: {
    height: 88,
    textAlignVertical: "top"
  },
  row: {
    flexDirection: "row",
    gap: 12
  },
  rowItem: {
    flex: 1
  },
  submitButton: {
    backgroundColor: "#ef2b2d",
    borderRadius: 999,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 6
  },
  submitLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#fff"
  },
  suggestionCard: {
    backgroundColor: "#eef2ff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8
  },
  suggestionTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#1d2f73",
    marginBottom: 6
  },
  suggestionItem: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#374b63"
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  goalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#111f34"
  },
  goalVehicle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b"
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffe9ec",
    borderRadius: 999
  },
  deleteText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#ef2b2d"
  },
  goalMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  goalMetaLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#5d6b7e"
  },
  goalMetaValue: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#111f34"
  },
  goalNotes: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#4b5a6b",
    marginTop: 8,
    lineHeight: 19
  },
  goalFooter: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e1e5f0",
    paddingTop: 10
  },
  goalFooterText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    color: "#7a8799"
  },
  emptyState: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    textAlign: "center",
    color: "#4b5a6b",
    paddingVertical: 40
  }
});

export default GoalsScreen;

