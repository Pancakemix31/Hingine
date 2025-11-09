import type { Car } from "@/data/cars";
import type {
  FinancialPreferences,
  FinancePreferences,
  LeasePreferences,
  Profile
} from "@/context/AppContext";

type MatchScoreInput = {
  car: Car;
  profile: Profile;
  financialPreferences?: FinancialPreferences | null;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const resolveTargetMonthly = (
  profile: Profile,
  financialPreferences?: FinancialPreferences | null
) => {
  const explicitMonthly = financialPreferences?.monthlyPayment;
  const fallbackMonthly = profile.monthlyBudget;
  const resolved = explicitMonthly && explicitMonthly > 0 ? explicitMonthly : fallbackMonthly;
  return Math.max(resolved, 200);
};

const resolveUpfrontBudget = (
  profile: Profile,
  financialPreferences?: FinancialPreferences | null
) => {
  if (!financialPreferences) {
    return Math.max(Math.round(profile.monthlyBudget * 2.5), 1500);
  }

  if (financialPreferences.financingType === "finance") {
    return (financialPreferences as FinancePreferences).downPayment;
  }

  return (financialPreferences as LeasePreferences).dueAtSigning;
};

export const calculateMatchScore = ({
  car,
  profile,
  financialPreferences
}: MatchScoreInput): number => {
  const financingMode = financialPreferences?.financingType ?? "finance";
  const targetMonthly = resolveTargetMonthly(profile, financialPreferences);
  const carMonthly = financingMode === "lease" ? car.monthlyLease : car.monthlyFinance;

  const paymentGap = carMonthly - targetMonthly;
  const paymentScore =
    paymentGap <= 0
      ? 100
      : clamp(100 - (paymentGap / targetMonthly) * 120, 8, 100);

  const upfrontBudget = resolveUpfrontBudget(profile, financialPreferences);
  const expectedUpfront =
    financingMode === "finance"
      ? Math.max(Math.round(car.msrp * 0.1), 1500)
      : 2000;
  const upfrontGap = expectedUpfront - upfrontBudget;
  const upfrontScore =
    upfrontGap <= 0
      ? 100
      : clamp(100 - (upfrontGap / expectedUpfront) * 100, 20, 100);

  const creditLowerBound = 580;
  const creditUpperBound = 800;
  const normalizedCredit = clamp(
    ((profile.creditScoreEstimate ?? creditLowerBound) - creditLowerBound) /
      (creditUpperBound - creditLowerBound),
    0,
    1
  );
  const creditScore = clamp(normalizedCredit * 100, 10, 100);

  const monthlyHeadroom = Math.max(0, targetMonthly - carMonthly);
  const headroomBonus = clamp((monthlyHeadroom / targetMonthly) * 18, 0, 10);

  const weightedScore =
    paymentScore * 0.58 + upfrontScore * 0.24 + creditScore * 0.12 + headroomBonus;

  return clamp(Math.round(weightedScore), 1, 100);
};

export type ScoredCar = Car & { matchScore: number };

export const scoreCars = (
  inventory: Car[],
  profile: Profile,
  financialPreferences?: FinancialPreferences | null
): ScoredCar[] =>
  inventory
    .map((car) => ({
      ...car,
      matchScore: calculateMatchScore({ car, profile, financialPreferences })
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

