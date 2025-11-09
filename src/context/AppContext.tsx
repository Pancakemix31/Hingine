import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { offers } from "@/data/offers";
import { lessons } from "@/data/lessons";

export type SwipeDecision = "like" | "skip";

export type Goal = {
  id: string;
  title: string;
  targetVehicle?: string;
  targetDate?: string;
  targetBudget: number;
  monthlyContribution: number;
  notes?: string;
  createdAt: string;
};

export type Profile = {
  name: string;
  age: number;
  school: string;
  major: string;
  graduationYear: number;
  email: string;
  phone: string;
  monthlyBudget: number;
  creditScoreEstimate: number;
};

export type FinancePreferences = {
  financingType: "finance";
  monthlyPayment: number;
  downPayment: number;
  termLength: number;
};

export type LeasePreferences = {
  financingType: "lease";
  monthlyPayment: number;
  dueAtSigning: number;
  mileageAllowance: number;
  leaseTerm: number;
};

export type FinancialPreferences = FinancePreferences | LeasePreferences;

export type AppState = {
  points: number;
  level: number;
  completedLessons: string[];
  swipeHistory: Array<{
    carId: string;
    decision: SwipeDecision;
    matchScore: number;
    timestamp: number;
  }>;
  savedCars: string[];
  goals: Goal[];
  profile: Profile;
  financialPreferences: FinancialPreferences | null;
};

export type AppContextValue = {
  state: AppState;
  completeLesson: (lessonId: string) => number;
  recordSwipe: (carId: string, decision: SwipeDecision, matchScore: number) => void;
  toggleSavedCar: (carId: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updateFinancialPreferences: (preferences: FinancialPreferences) => void;
  resetProgress: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialProfile: Profile = {
  name: "Mustafa Hasani",
  age: 20,
  school: "UT Dallas",
  major: "Finance",
  graduationYear: 2027,
  email: "mustafa.hasani@utdallas.edu",
  phone: "555-0133",
  monthlyBudget: 220,
  creditScoreEstimate: 794
};

const initialState: AppState = {
  points: 0,
  level: 1,
  completedLessons: [],
  swipeHistory: [],
  savedCars: [],
  goals: [],
  profile: initialProfile,
  financialPreferences: null
};

const LEVEL_SIZE = 250;

const calculateLevel = (points: number) => Math.max(1, Math.floor(points / LEVEL_SIZE) + 1);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  const completeLesson = useCallback(
    (lessonId: string) => {
      const lesson = lessons.find((item) => item.id === lessonId);
      if (!lesson) {
        return 0;
      }

      let pointsEarned = lesson.points;

      setState((prev) => {
        if (prev.completedLessons.includes(lessonId)) {
          return prev;
        }

        const nextPoints = prev.points + pointsEarned;
        return {
          ...prev,
          points: nextPoints,
          level: calculateLevel(nextPoints),
          completedLessons: [...prev.completedLessons, lessonId]
        };
      });

      return pointsEarned;
    },
    []
  );

  const recordSwipe = useCallback((carId: string, decision: SwipeDecision, matchScore: number) => {
    setState((prev) => ({
      ...prev,
      swipeHistory: [
        {
          carId,
          decision,
          matchScore,
          timestamp: Date.now()
        },
        ...prev.swipeHistory
      ].slice(0, 20),
      savedCars:
        decision === "like"
          ? Array.from(new Set([carId, ...prev.savedCars])).slice(0, 20)
          : prev.savedCars
    }));
  }, []);

  const toggleSavedCar = useCallback((carId: string) => {
    setState((prev) => {
      const isSaved = prev.savedCars.includes(carId);
      return {
        ...prev,
        savedCars: isSaved ? prev.savedCars.filter((id) => id !== carId) : [carId, ...prev.savedCars]
      };
    });
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      goals: [
        {
          ...goal,
          id: `goal-${Date.now()}`,
          createdAt: new Date().toISOString()
        },
        ...prev.goals
      ]
    }));
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal))
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId)
    }));
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  }, []);

  const updateFinancialPreferences = useCallback((preferences: FinancialPreferences) => {
    setState((prev) => ({
      ...prev,
      financialPreferences: preferences
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(
    () => ({
      state,
      completeLesson,
      recordSwipe,
      toggleSavedCar,
      addGoal,
      updateGoal,
      deleteGoal,
      updateProfile,
      updateFinancialPreferences,
      resetProgress
    }),
    [
      state,
      completeLesson,
      recordSwipe,
      toggleSavedCar,
      addGoal,
      updateGoal,
      deleteGoal,
      updateProfile,
      updateFinancialPreferences,
      resetProgress
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

