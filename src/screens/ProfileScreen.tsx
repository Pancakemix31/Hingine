import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { cars } from "@/data/cars";
import { lessons } from "@/data/lessons";
import { useAppContext } from "@/context/AppContext";

const LEVEL_SIZE = 250;

type SectionKey =
  | "financialSnapshot"
  | "academicProfile"
  | "financialDetails"
  | "learningProgress"
  | "preferences";

const ProfileScreen = () => {
  const { state, updateProfile } = useAppContext();

  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    financialSnapshot: true,
    academicProfile: false,
    financialDetails: false,
    learningProgress: false,
    preferences: false
  });

  const [isFinancialEditing, setIsFinancialEditing] = useState(false);
  const [editableBudget, setEditableBudget] = useState(state.profile.monthlyBudget.toString());
  const [editableCredit, setEditableCredit] = useState(state.profile.creditScoreEstimate.toString());
  const [academicGpa, setAcademicGpa] = useState("3.6");
  const [monthlyIncome, setMonthlyIncome] = useState("2200");
  const [savingsGoal, setSavingsGoal] = useState("5000");
  const [paymentPlan, setPaymentPlan] = useState("Finance • 60 months");

  const swipeSummary = useMemo(
    () => ({
      likes: state.swipeHistory.filter((entry) => entry.decision === "like").length,
      passes: state.swipeHistory.filter((entry) => entry.decision === "skip").length
    }),
    [state.swipeHistory]
  );

  const initials = useMemo(() => {
    const parts = state.profile.name.trim().split(/\s+/);
    if (!parts.length) {
      return "";
    }
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [state.profile.name]);

  const primaryVehicle = useMemo(() => {
    const primaryId = state.savedCars[0];
    if (!primaryId) {
      return undefined;
    }
    return cars.find((car) => car.id === primaryId);
  }, [state.savedCars]);

  const completedLessonDetails = useMemo(
    () => lessons.filter((lesson) => state.completedLessons.includes(lesson.id)),
    [state.completedLessons]
  );

  const nextLesson = useMemo(
    () => lessons.find((lesson) => !state.completedLessons.includes(lesson.id)),
    [state.completedLessons]
  );

  const levelBasePoints = Math.max(0, (state.level - 1) * LEVEL_SIZE);
  const progressWithinLevel = Math.max(0, state.points - levelBasePoints);
  const progressPercent = Math.min(1, LEVEL_SIZE === 0 ? 0 : progressWithinLevel / LEVEL_SIZE);
  const pointsToNextLevel = Math.max(0, LEVEL_SIZE - progressWithinLevel);
  const lessonsProgress = lessons.length === 0 ? 0 : completedLessonDetails.length / lessons.length;
  const incentiveEligible = state.profile.creditScoreEstimate >= 680;
  const levelProgressWidth = progressPercent === 0 ? 0 : Math.max(progressPercent * 100, 6);
  const lessonProgressWidth = lessonsProgress === 0 ? 0 : Math.max(lessonsProgress * 100, 6);

  const toggleSection = (key: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFinancialSave = () => {
    const parsedBudget = parseInt(editableBudget, 10);
    const parsedCredit = parseInt(editableCredit, 10);

    updateProfile({
      monthlyBudget: Number.isNaN(parsedBudget) ? state.profile.monthlyBudget : parsedBudget,
      creditScoreEstimate: Number.isNaN(parsedCredit) ? state.profile.creditScoreEstimate : parsedCredit
    });

    setIsFinancialEditing(false);
  };

  const handleFinancialCancel = () => {
    setEditableBudget(state.profile.monthlyBudget.toString());
    setEditableCredit(state.profile.creditScoreEstimate.toString());
    setIsFinancialEditing(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>{state.profile.name}</Text>
            <Text style={styles.profileMeta}>
              {state.profile.major} @ {state.profile.school}
            </Text>
            <Text style={styles.profileMeta}>Class of {state.profile.graduationYear}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Level {state.level}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Learning track progress</Text>
            <Text style={styles.progressLabelSecondary}>
              {pointsToNextLevel === 0 ? "Maxed for now" : `${pointsToNextLevel} pts to L${state.level + 1}`}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${levelProgressWidth}%` }]} />
          </View>
        </View>

        <View style={styles.contactGrid}>
          <View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{state.profile.email}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{state.profile.phone}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Toyota ID</Text>
            <Text style={styles.infoValue}>STU-{state.profile.graduationYear}</Text>
          </View>
        </View>

        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleLabel}>Current lineup</Text>
          <Text style={styles.vehicleName}>
            {primaryVehicle ? primaryVehicle.name : "No saved vehicles yet"}
          </Text>
          <Text style={styles.vehicleMeta}>
            {primaryVehicle
              ? `${primaryVehicle.trim} • Est. $${primaryVehicle.monthlyFinance}/mo`
              : "Save a ride to see it featured here."}
          </Text>
        </View>
      </View>

      <View style={[styles.sectionCard, styles.sectionCardDark]}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.sectionTitleWrap}
            onPress={() => toggleSection("financialSnapshot")}
            activeOpacity={0.7}
          >
            <Text style={[styles.sectionTitle, styles.sectionTitleDark]}>Financial Snapshot</Text>
            <Text style={[styles.sectionToggle, styles.sectionToggleDark]}>
              {expandedSections.financialSnapshot ? "−" : "+"}
            </Text>
          </TouchableOpacity>
          <View style={styles.sectionHeaderActions}>
            {isFinancialEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.pillButton, styles.pillButtonGhostDark]}
                  onPress={handleFinancialCancel}
                >
                  <Text style={[styles.pillButtonText, styles.pillButtonTextDark]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pillButton, styles.pillButtonPrimary]}
                  onPress={handleFinancialSave}
                >
                  <Text style={[styles.pillButtonText, styles.pillButtonTextLight]}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.pillButton, styles.pillButtonGhostDark]}
                onPress={() => setIsFinancialEditing(true)}
              >
                <Text style={[styles.pillButtonText, styles.pillButtonTextDark]}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {expandedSections.financialSnapshot ? (
          <View style={styles.sectionContent}>
            <View style={styles.snapshotRow}>
              <View style={styles.snapshotItem}>
                <Text style={styles.infoLabelMuted}>Monthly comfort zone</Text>
                {isFinancialEditing ? (
                  <TextInput
                    style={[styles.textInput, styles.textInputDark]}
                    keyboardType="numeric"
                    value={editableBudget}
                    onChangeText={setEditableBudget}
                  />
                ) : (
                  <Text style={styles.snapshotValueLight}>${state.profile.monthlyBudget}</Text>
                )}
              </View>
              <View style={styles.snapshotItem}>
                <Text style={styles.infoLabelMuted}>Credit score estimate</Text>
                {isFinancialEditing ? (
                  <TextInput
                    style={[styles.textInput, styles.textInputDark]}
                    keyboardType="numeric"
                    value={editableCredit}
                    onChangeText={setEditableCredit}
                  />
                ) : (
                  <Text style={styles.snapshotValueLight}>{state.profile.creditScoreEstimate}</Text>
                )}
              </View>
            </View>
            <View style={styles.snapshotRow}>
              <View style={styles.snapshotItem}>
                <Text style={styles.infoLabelMuted}>Eligible for incentives</Text>
                <View
                  style={[
                    styles.badge,
                    incentiveEligible ? styles.badgePositive : styles.badgeMuted
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      incentiveEligible ? styles.badgeTextPositive : styles.badgeTextMuted
                    ]}
                  >
                    {incentiveEligible ? "Eligible" : "Keep building"}
                  </Text>
                </View>
              </View>
              <View style={styles.snapshotItem}>
                <Text style={styles.infoLabelMuted}>Incentive points</Text>
                <Text style={styles.snapshotValueLight}>{state.points}</Text>
              </View>
            </View>
            <View style={styles.financialSummaryRow}>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillTitle}>Matches</Text>
                <Text style={styles.summaryPillValue}>{swipeSummary.likes}</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillTitle}>Skips</Text>
                <Text style={styles.summaryPillValue}>{swipeSummary.passes}</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillTitle}>Lessons</Text>
                <Text style={styles.summaryPillValue}>{completedLessonDetails.length}</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.sectionTitleWrap}
            onPress={() => toggleSection("academicProfile")}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Academic Profile</Text>
            <Text style={styles.sectionToggle}>
              {expandedSections.academicProfile ? "−" : "+"}
            </Text>
          </TouchableOpacity>
        </View>
        {expandedSections.academicProfile ? (
          <View style={styles.sectionContent}>
            <View style={styles.snapshotRow}>
              <View style={styles.snapshotItem}>
                <Text style={styles.infoLabel}>GPA (self-reported)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="decimal-pad"
                  value={academicGpa}
                  onChangeText={setAcademicGpa}
                  maxLength={4}
                />
              </View>
              <View style={styles.snapshotItem}>
                <Text style={styles.infoLabel}>Incentive eligibility</Text>
                <Text style={styles.infoValue}>
                  Earn bonus points for verified transcripts
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.uploadBox} onPress={() => {}}>
              <Text style={styles.uploadTitle}>Upload latest transcript</Text>
              <Text style={styles.uploadSubtitle}>PDF, JPG, or PNG • Secure & private</Text>
            </TouchableOpacity>
            <Text style={styles.helperCopy}>
              Transcripts help unlock Toyota Scholars incentives, similar to how safe-driving apps
              reward responsible habits.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.sectionTitleWrap}
            onPress={() => toggleSection("financialDetails")}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Financial Details</Text>
            <Text style={styles.sectionToggle}>
              {expandedSections.financialDetails ? "−" : "+"}
            </Text>
          </TouchableOpacity>
        </View>
        {expandedSections.financialDetails ? (
          <View style={styles.sectionContent}>
            <View style={styles.inputStack}>
              <View style={styles.inputRow}>
                <Text style={styles.infoLabel}>Estimated monthly income</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  placeholder="$0"
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.infoLabel}>Current savings goal</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={savingsGoal}
                  onChangeText={setSavingsGoal}
                  placeholder="$0"
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.infoLabel}>Preferred payment plan</Text>
                <TextInput
                  style={styles.textInput}
                  value={paymentPlan}
                  onChangeText={setPaymentPlan}
                  placeholder="Lease or finance"
                />
              </View>
            </View>
            <Text style={styles.helperCopy}>
              These details stay private to you and help us build smarter monthly scenarios that
              sync with your comfort zone.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.sectionTitleWrap}
            onPress={() => toggleSection("learningProgress")}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Learning Progress</Text>
            <Text style={styles.sectionToggle}>
              {expandedSections.learningProgress ? "−" : "+"}
            </Text>
          </TouchableOpacity>
        </View>
        {expandedSections.learningProgress ? (
          <View style={styles.sectionContent}>
            <View style={styles.progressBlock}>
              <View style={styles.progressRow}>
                <Text style={styles.infoLabel}>Lessons completed</Text>
                <Text style={styles.infoValue}>
                  {completedLessonDetails.length}/{lessons.length}
                </Text>
              </View>
              <View style={styles.progressTrackLight}>
                <View
                  style={[
                    styles.progressFillAccent,
                  { width: `${lessonProgressWidth}%` }
                  ]}
                />
              </View>
            </View>
            <View style={styles.lessonList}>
              {completedLessonDetails.slice(0, 3).map((lesson) => (
                <View key={lesson.id} style={styles.lessonItem}>
                  <View style={styles.lessonBadge}>
                    <Text style={styles.lessonBadgeText}>{lesson.category}</Text>
                  </View>
                  <View style={styles.lessonCopy}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonMeta}>{lesson.duration}</Text>
                  </View>
                </View>
              ))}
              {completedLessonDetails.length === 0 ? (
                <Text style={styles.helperCopy}>Complete your first lesson to unlock bonuses.</Text>
              ) : null}
            </View>
            {nextLesson ? (
              <View style={styles.nextLesson}>
                <Text style={styles.nextLessonTitle}>Up next</Text>
                <Text style={styles.nextLessonName}>{nextLesson.title}</Text>
                <Text style={styles.nextLessonMeta}>
                  {nextLesson.category} • {nextLesson.duration}
                </Text>
              </View>
            ) : null}
            <View style={styles.chipRow}>
              <View style={styles.statusChip}>
                <Text style={styles.statusChipText}>Matches {swipeSummary.likes}</Text>
              </View>
              <View style={styles.statusChip}>
                <Text style={styles.statusChipText}>Skips {swipeSummary.passes}</Text>
              </View>
              <View style={styles.statusChip}>
                <Text style={styles.statusChipText}>
                  Total points {state.points}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.sectionTitleWrap}
            onPress={() => toggleSection("preferences")}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Account & Preferences</Text>
            <Text style={styles.sectionToggle}>
              {expandedSections.preferences ? "−" : "+"}
            </Text>
          </TouchableOpacity>
        </View>
        {expandedSections.preferences ? (
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.preferenceButton} onPress={() => {}}>
              <Text style={styles.preferenceTitle}>Edit profile details</Text>
              <Text style={styles.preferenceSubtitle}>Update name, contact info, program specifics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preferenceButton} onPress={() => {}}>
              <Text style={styles.preferenceTitle}>Notification preferences</Text>
              <Text style={styles.preferenceSubtitle}>Choose how often to receive Toyota Scholar nudges</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preferenceButton} onPress={() => {}}>
              <Text style={styles.preferenceTitle}>Privacy & data controls</Text>
              <Text style={styles.preferenceSubtitle}>Review consent for transcript uploads and incentives</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.preferenceButton, styles.preferenceButtonDanger]}
              onPress={() => {}}
            >
              <Text style={styles.preferenceTitleDanger}>Log out</Text>
              <Text style={styles.preferenceSubtitle}>Sign out of Hingine</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f6fb"
  },
  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 160,
    gap: 18
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e8edff",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarInitials: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: "#1d2f73"
  },
  headerText: {
    flex: 1,
    gap: 4
  },
  pageTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: "#111f34"
  },
  profileMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: "#4b5a6b"
  },
  levelBadge: {
    backgroundColor: "#1d2f73",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999
  },
  levelBadgeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#fff"
  },
  progressContainer: {
    gap: 12
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  progressLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#111f34"
  },
  progressLabelSecondary: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#4b5a6b"
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e4e9f5",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#1d2f73"
  },
  contactGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 12,
    columnGap: 24
  },
  infoLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#5d6b7e"
  },
  infoValue: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#111f34",
    marginTop: 4
  },
  vehicleCard: {
    backgroundColor: "#f4f7ff",
    borderRadius: 20,
    padding: 18,
    gap: 6
  },
  vehicleLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1d2f73"
  },
  vehicleName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#111f34"
  },
  vehicleMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#4b5a6b"
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  sectionCardDark: {
    backgroundColor: "#111f34"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#111f34"
  },
  sectionTitleDark: {
    color: "#fff"
  },
  sectionToggle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 22,
    color: "#1d2f73"
  },
  sectionToggleDark: {
    color: "#fff"
  },
  sectionHeaderActions: {
    flexDirection: "row",
    gap: 8
  },
  sectionContent: {
    marginTop: 18,
    gap: 18
  },
  pillButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  pillButtonGhostDark: {
    backgroundColor: "rgba(255, 255, 255, 0.14)"
  },
  pillButtonPrimary: {
    backgroundColor: "#2b8dee"
  },
  pillButtonText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13
  },
  pillButtonTextDark: {
    color: "#fff"
  },
  pillButtonTextLight: {
    color: "#fff"
  },
  snapshotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18
  },
  snapshotItem: {
    flex: 1,
    gap: 8
  },
  infoLabelMuted: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#b8c6ff"
  },
  snapshotValueLight: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#fff"
  },
  textInput: {
    backgroundColor: "#f5f7fb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#111f34"
  },
  textInputDark: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    color: "#fff"
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start"
  },
  badgePositive: {
    backgroundColor: "#31d38b"
  },
  badgeMuted: {
    backgroundColor: "rgba(255, 255, 255, 0.12)"
  },
  badgeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12
  },
  badgeTextPositive: {
    color: "#0f3b28"
  },
  badgeTextMuted: {
    color: "#fff"
  },
  financialSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  summaryPill: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    gap: 4
  },
  summaryPillTitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    color: "#b8c6ff"
  },
  summaryPillValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#fff"
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#c8d3ff",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 6
  },
  uploadTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1d2f73"
  },
  uploadSubtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#5d6b7e"
  },
  helperCopy: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#5d6b7e",
    lineHeight: 18
  },
  inputStack: {
    gap: 14
  },
  inputRow: {
    gap: 8
  },
  progressBlock: {
    gap: 10
  },
  progressTrackLight: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e7ecf7",
    overflow: "hidden"
  },
  progressFillAccent: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2b8dee"
  },
  lessonList: {
    gap: 12
  },
  lessonItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },
  lessonBadge: {
    backgroundColor: "#f0f4ff",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  lessonBadgeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#1d2f73"
  },
  lessonCopy: {
    flex: 1,
    gap: 4
  },
  lessonTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#111f34"
  },
  lessonMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    color: "#5d6b7e"
  },
  nextLesson: {
    backgroundColor: "#f5faff",
    borderRadius: 18,
    padding: 16,
    gap: 4
  },
  nextLessonTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1d2f73"
  },
  nextLessonName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#111f34"
  },
  nextLessonMeta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 12,
    color: "#5d6b7e"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statusChip: {
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  statusChipText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#1d2f73"
  },
  preferenceButton: {
    backgroundColor: "#f5f7fb",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 6
  },
  preferenceTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#111f34"
  },
  preferenceSubtitle: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: "#5d6b7e"
  },
  preferenceButtonDanger: {
    backgroundColor: "#ffecec"
  },
  preferenceTitleDanger: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15,
    color: "#b91c1c"
  }
});

export default ProfileScreen;

