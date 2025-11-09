import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import CarCard from "@/components/CarCard";
import { cars } from "@/data/cars";
import { useAppContext } from "@/context/AppContext";
import type { FinancialPreferences, FinancePreferences, LeasePreferences } from "@/context/AppContext";
import { scoreCars, type ScoredCar } from "@/utils/match";

const SWIPE_THRESHOLD = 120;
const SCREEN_WIDTH = Dimensions.get("window").width;

const SwipeScreen = () => {
  const { state, recordSwipe, updateFinancialPreferences } = useAppContext();
  const { financialPreferences, profile } = state;
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const initialFinancingType = financialPreferences?.financingType ?? "finance";
  const [financingType, setFinancingType] = useState<FinancialPreferences["financingType"]>(initialFinancingType);
  const [monthlyPayment, setMonthlyPayment] = useState(() =>
    financialPreferences ? String(financialPreferences.monthlyPayment) : String(profile.monthlyBudget)
  );
  const [downPayment, setDownPayment] = useState(
    financialPreferences?.financingType === "finance" ? String(financialPreferences.downPayment) : "2500"
  );
  const [loanTerm, setLoanTerm] = useState(
    financialPreferences?.financingType === "finance" ? String(financialPreferences.termLength) : "48"
  );
  const [dueAtSigning, setDueAtSigning] = useState(
    financialPreferences?.financingType === "lease" ? String(financialPreferences.dueAtSigning) : "2000"
  );
  const [leaseTerm, setLeaseTerm] = useState(
    financialPreferences?.financingType === "lease" ? String(financialPreferences.leaseTerm) : "36"
  );
  const [mileageAllowance, setMileageAllowance] = useState(
    financialPreferences?.financingType === "lease" ? String(financialPreferences.mileageAllowance) : "12000"
  );
  const financingOptions: FinancialPreferences["financingType"][] = ["finance", "lease"];
  const [isEditingPreferences, setIsEditingPreferences] = useState(!financialPreferences);
  const isFirstTimePreferences = !financialPreferences;

  useEffect(() => {
    if (!financialPreferences) {
      setIsEditingPreferences(true);
    }
  }, [financialPreferences]);

  useEffect(() => {
    if (!isEditingPreferences) {
      return;
    }

    if (financialPreferences?.financingType === "finance") {
      const prefs = financialPreferences as FinancePreferences;
      setFinancingType("finance");
      setMonthlyPayment(String(prefs.monthlyPayment));
      setDownPayment(String(prefs.downPayment));
      setLoanTerm(String(prefs.termLength));
      setDueAtSigning("2000");
      setLeaseTerm("36");
      setMileageAllowance("12000");
      return;
    }

    if (financialPreferences?.financingType === "lease") {
      const prefs = financialPreferences as LeasePreferences;
      setFinancingType("lease");
      setMonthlyPayment(String(prefs.monthlyPayment));
      setDueAtSigning(String(prefs.dueAtSigning));
      setLeaseTerm(String(prefs.leaseTerm));
      setMileageAllowance(String(prefs.mileageAllowance));
      setDownPayment("2500");
      setLoanTerm("48");
      return;
    }

    setFinancingType("finance");
    setMonthlyPayment(String(profile.monthlyBudget));
    setDownPayment("2500");
    setLoanTerm("48");
    setDueAtSigning("2000");
    setLeaseTerm("36");
    setMileageAllowance("12000");
  }, [isEditingPreferences, financialPreferences, profile.monthlyBudget]);

  const handleNumericChange =
    (setter: (value: string) => void) =>
    (value: string) => {
      const sanitized = value.replace(/[^0-9]/g, "");
      setter(sanitized);
    };

  const isFinanceMode = financingType === "finance";

  const isFormValid =
    monthlyPayment.trim().length > 0 &&
    Number(monthlyPayment) > 0 &&
    (isFinanceMode
      ? downPayment.trim().length > 0 &&
        loanTerm.trim().length > 0 &&
        Number(downPayment) >= 0 &&
        Number(loanTerm) > 0
      : dueAtSigning.trim().length > 0 &&
        leaseTerm.trim().length > 0 &&
        mileageAllowance.trim().length > 0 &&
        Number(dueAtSigning) >= 0 &&
        Number(leaseTerm) > 0 &&
        Number(mileageAllowance) > 0);

  const handleSavePreferences = () => {
    if (!isFormValid) {
      return;
    }

    if (financingType === "finance") {
      updateFinancialPreferences({
        financingType: "finance",
        monthlyPayment: Number(monthlyPayment),
        downPayment: Number(downPayment),
        termLength: Number(loanTerm)
      });
    } else {
      updateFinancialPreferences({
        financingType: "lease",
        monthlyPayment: Number(monthlyPayment),
        dueAtSigning: Number(dueAtSigning),
        mileageAllowance: Number(mileageAllowance),
        leaseTerm: Number(leaseTerm)
      });
    }
    setIsEditingPreferences(false);
  };

  const scoredCars = useMemo<ScoredCar[]>(
    () => scoreCars(cars, profile, financialPreferences),
    [financialPreferences, profile]
  );

  useEffect(() => {
    setIndex(0);
  }, [financialPreferences, profile]);

  const animatedCardStyle = useMemo(
    () => ({
      transform: [
        ...position.getTranslateTransform(),
        {
          rotate: position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ["-20deg", "0deg", "20deg"]
          })
        }
      ],
      opacity: position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [0.6, 1, 0.6]
      })
    }),
    [position]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderMove: (_, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe("right");
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe("left");
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true
            }).start();
          }
        }
      }),
    [position, index]
  );

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 });
  };

  const advanceCard = (totalCars = scoredCars.length) => {
    if (totalCars === 0) {
      return;
    }
    setIndex((prev) => (prev + 1) % totalCars);
    resetPosition();
  };

  const forceSwipe = (direction: "left" | "right") => {
    if (scoredCars.length === 0) {
      return;
    }
    const x = direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 240,
      useNativeDriver: true
    }).start(() => {
      const car = scoredCars[index];
      if (!car) {
        resetPosition();
        return;
      }
      recordSwipe(car.id, direction === "right" ? "like" : "skip", car.matchScore);
      advanceCard(scoredCars.length);
    });
  };

  const currentCar = scoredCars[index];
  const nextCar = scoredCars.length > 1 ? scoredCars[(index + 1) % scoredCars.length] : undefined;

  if (isEditingPreferences) {
    const titleCopy = isFirstTimePreferences
      ? "Before we match you with vehicles, let’s calibrate the financing that fits your lifestyle."
      : "Update your financing preferences so we can refresh your Toyota matches.";
    const headlineCopy = isFirstTimePreferences ? "Your financial comfort zone" : "Refresh your financial comfort zone";
    const submitLabel = isFirstTimePreferences ? "Save & See My Matches" : "Update & Refresh Matches";

    return (
      <ScrollView style={styles.preferenceScroll} contentContainerStyle={styles.preferenceContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            Toyota <Text style={styles.eyebrowAccent}>Match</Text>
          </Text>
          <Text style={styles.title}>{titleCopy}</Text>
        </View>

        <View style={styles.preferencesCard}>
          <Text style={styles.preferenceHeadline}>{headlineCopy}</Text>
          <Text style={styles.preferenceCopy}>
            Share the basics so we can surface Toyota options that respect your budget today and after graduation.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Financing style</Text>
            <View style={styles.toggleRow}>
              {financingOptions.map((type, index) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.toggleButton,
                    index !== financingOptions.length - 1 ? styles.toggleButtonSpacing : undefined,
                    financingType === type ? styles.toggleButtonActive : undefined
                  ]}
                  onPress={() => setFinancingType(type)}
                >
                  <Text
                    style={[
                      styles.toggleLabel,
                      financingType === type ? styles.toggleLabelActive : undefined
                    ]}
                  >
                    {type === "finance" ? "Finance" : "Lease"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {isFinanceMode ? "Monthly payment ceiling" : "Monthly payment target"}
            </Text>
            <TextInput
              style={styles.textInput}
              value={monthlyPayment}
              onChangeText={handleNumericChange(setMonthlyPayment)}
              keyboardType="numeric"
              placeholder="e.g. 400"
              placeholderTextColor="#9aa5b5"
            />
            <Text style={styles.fieldHelper}>
              {isFinanceMode
                ? "We’ll only recommend cars with payments at or below this number."
                : "We’ll only recommend leases that keep you under this number each month."}
            </Text>
          </View>

          {isFinanceMode ? (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Cash ready for a down payment</Text>
                <TextInput
                  style={styles.textInput}
                  value={downPayment}
                  onChangeText={handleNumericChange(setDownPayment)}
                  keyboardType="numeric"
                  placeholder="e.g. 2500"
                  placeholderTextColor="#9aa5b5"
                />
                <Text style={styles.fieldHelper}>
                  A larger down payment can unlock lower monthly payments and APR offers.
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Preferred loan term (months)</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanTerm}
                  onChangeText={handleNumericChange(setLoanTerm)}
                  keyboardType="numeric"
                  placeholder="e.g. 48"
                  placeholderTextColor="#9aa5b5"
                />
                <Text style={styles.fieldHelper}>Shorter terms mean higher payments but faster payoff.</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Due at signing budget</Text>
                <TextInput
                  style={styles.textInput}
                  value={dueAtSigning}
                  onChangeText={handleNumericChange(setDueAtSigning)}
                  keyboardType="numeric"
                  placeholder="e.g. 2000"
                  placeholderTextColor="#9aa5b5"
                />
                <Text style={styles.fieldHelper}>
                  We’ll look for leases with upfront costs at or under this amount.
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Annual mileage comfort</Text>
                <TextInput
                  style={styles.textInput}
                  value={mileageAllowance}
                  onChangeText={handleNumericChange(setMileageAllowance)}
                  keyboardType="numeric"
                  placeholder="e.g. 12000"
                  placeholderTextColor="#9aa5b5"
                />
                <Text style={styles.fieldHelper}>
                  Higher mileage allowances can increase monthly cost.
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Lease term length (months)</Text>
                <TextInput
                  style={styles.textInput}
                  value={leaseTerm}
                  onChangeText={handleNumericChange(setLeaseTerm)}
                  keyboardType="numeric"
                  placeholder="e.g. 36"
                  placeholderTextColor="#9aa5b5"
                />
                <Text style={styles.fieldHelper}>
                  Most leases run 24-48 months—pick what fits your plans.
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.submitButton, !isFormValid ? styles.submitButtonDisabled : undefined]}
            onPress={handleSavePreferences}
            disabled={!isFormValid}
          >
            <Text style={styles.submitButtonLabel}>{submitLabel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.matchScroll} contentContainerStyle={styles.matchContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            Toyota <Text style={styles.eyebrowAccent}>Match</Text>
          </Text>
          <Text style={styles.title}>
            Swipe into your next Toyota with financing that fits a student budget.
          </Text>
        </View>
        <View style={styles.preferenceSummary}>
          <View style={styles.preferenceSummaryHeader}>
            <Text style={styles.summaryTitle}>Financial preferences</Text>
            <TouchableOpacity onPress={() => setIsEditingPreferences(true)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.editPreferencesLabel}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCell}>
              <Text style={styles.summaryLabel}>
                {financialPreferences.financingType === "finance" ? "Monthly max" : "Monthly target"}
              </Text>
              <Text style={styles.summaryValue}>${financialPreferences.monthlyPayment.toLocaleString()}</Text>
            </View>
            {financialPreferences.financingType === "finance" ? (
              <>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>Down payment</Text>
                  <Text style={styles.summaryValue}>
                    ${(financialPreferences as FinancePreferences).downPayment.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>Loan term</Text>
                  <Text style={styles.summaryValue}>
                    {(financialPreferences as FinancePreferences).termLength} mo · Finance
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>Due at signing</Text>
                  <Text style={styles.summaryValue}>
                    ${(financialPreferences as LeasePreferences).dueAtSigning.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>Mileage cap</Text>
                  <Text style={styles.summaryValue}>
                    {(financialPreferences as LeasePreferences).mileageAllowance.toLocaleString()} mi/yr
                  </Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>Lease term</Text>
                  <Text style={styles.summaryValue}>
                    {(financialPreferences as LeasePreferences).leaseTerm} mo · Lease
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.swipeZone}>
          {nextCar ? (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale: 0.94 }], opacity: 0.5 }]}>
              <CarCard car={nextCar} matchLabel={`${nextCar.matchScore}% match`} />
            </Animated.View>
          ) : null}

          {currentCar ? (
            <Animated.View style={[styles.cardContainer, animatedCardStyle]} {...panResponder.panHandlers}>
              <CarCard car={currentCar} matchLabel={`${currentCar.matchScore}% match`} />
            </Animated.View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyHeadline}>You're all caught up!</Text>
              <Text style={styles.emptyCopy}>
                We’ll refresh Toyota pick lists with new inventory drops. In the meantime, check out your
                goals or take a lesson to unlock more offers.
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={advanceCard}>
                <Text style={styles.refreshButtonText}>See cars again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => forceSwipe("left")}
          >
            <Text style={[styles.actionLabel, styles.passLabel]}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.matchButton]}
            onPress={() => forceSwipe("right")}
          >
            <Text style={[styles.actionLabel, styles.matchLabel]}>Match</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  preferenceScroll: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  preferenceContent: {
    flexGrow: 1,
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 32
  },
  matchScroll: {
    flex: 1
  },
  matchContent: {
    paddingHorizontal: 18,
    paddingBottom: 48
  },
  screen: {
    flex: 1,
    paddingTop: 48,
    backgroundColor: "#f5f7fb"
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 0
  },
  eyebrow: {
    fontSize: 13,
    textTransform: "uppercase",
    color: "#ef2b2d",
    fontFamily: "Manrope_700Bold",
    letterSpacing: 1.2
  },
  eyebrowAccent: {
    fontFamily: "Manrope_600SemiBold",
    fontStyle: "italic",
    color: "#ef2b2d",
    textTransform: "uppercase",
    letterSpacing: 1.4
  },
  title: {
    fontSize: 22,
    marginTop: 6,
    fontFamily: "Manrope_700Bold",
    color: "#0b1f3a"
  },
  preferencesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 }
  },
  preferenceSummary: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }
  },
  preferenceSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#0b1f3a"
  },
  editPreferencesLabel: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#ef2b2d"
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 18
  },
  summaryCell: {
    width: "48%",
    marginBottom: 16
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#4c6072",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 6
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#0b1f3a"
  },
  preferenceHeadline: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#0b1f3a",
    marginBottom: 8
  },
  preferenceCopy: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: "#4c6072",
    marginBottom: 20
  },
  fieldGroup: {
    marginBottom: 20
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1f3551",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  textInput: {
    backgroundColor: "#f4f6fb",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
    color: "#0b1f3a"
  },
  fieldHelper: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: "#73859a",
    marginTop: 6,
    lineHeight: 18
  },
  toggleRow: {
    flexDirection: "row"
  },
  toggleButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#f4f6fb"
  },
  toggleButtonSpacing: {
    marginRight: 12
  },
  toggleButtonActive: {
    backgroundColor: "#0b1f3a"
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
    color: "#0b1f3a"
  },
  toggleLabelActive: {
    color: "#ffffff"
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#ef2b2d",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 }
  },
  submitButtonDisabled: {
    backgroundColor: "#f2a9ad",
    shadowOpacity: 0
  },
  submitButtonLabel: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#ffffff"
  },
  swipeZone: {
    minHeight: 480,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingTop: 12
  },
  cardContainer: {
    position: "absolute",
    width: "100%"
  },
  emptyState: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 }
  },
  emptyHeadline: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#0b1f3a",
    marginBottom: 12
  },
  emptyCopy: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: "#4c6072",
    textAlign: "center",
    marginBottom: 20
  },
  refreshButton: {
    backgroundColor: "#ef2b2d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999
  },
  refreshButtonText: {
    color: "#fff",
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 16,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  passButton: {
    backgroundColor: "#ffffff"
  },
  matchButton: {
    backgroundColor: "#ef2b2d"
  },
  actionLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17
  },
  passLabel: {
    color: "#0b1f3a"
  },
  matchLabel: {
    color: "#ffffff"
  }
});

export default SwipeScreen;

