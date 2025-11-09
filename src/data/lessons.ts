export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  category: "Budgeting" | "Credit" | "Ownership" | "EV & Hybrid";
  duration: string;
  points: number;
  description: string;
  objectives: string[];
  quiz: QuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    id: "budgeting-101",
    title: "Build a Student Car Budget",
    category: "Budgeting",
    duration: "5 min lesson • 3 question quiz",
    points: 120,
    description:
      "Learn how to calculate what you can realistically afford each month by mapping income, recurring expenses, and estimated vehicle costs.",
    objectives: [
      "Track income from campus jobs, internships, and scholarships",
      "Understand fixed vs. flexible expenses and how they influence your car plan",
      "Calculate an all-in monthly budget including insurance, fuel, and maintenance"
    ],
    quiz: [
      {
        id: "budgeting-101-q1",
        question:
          "You make $900 per month at your campus job. Experts recommend keeping total car costs under 15% of take-home pay. What is your target car budget?",
        options: ["$115", "$135", "$175", "$225"],
        answerIndex: 1,
        explanation:
          "Fifteen percent of $900 is $135. Staying near this number keeps room for savings and other student expenses."
      },
      {
        id: "budgeting-101-q2",
        question:
          "Which of the following should ALWAYS be included when planning a car budget?",
        options: [
          "Only the monthly payment",
          "Monthly payment plus insurance, fuel, parking, and maintenance",
          "Emergency repairs only",
          "Gym membership"
        ],
        answerIndex: 1,
        explanation:
          "Vehicle affordability is about the full cost of ownership—monthly payment plus insurance, fuel, parking, and maintenance."
      },
      {
        id: "budgeting-101-q3",
        question:
          "You receive a $3,000 internship stipend. What is the smartest way to use it when planning for a Toyota?",
        options: [
          "Put the entire amount toward a down payment to lower monthly costs",
          "Spend it on optional accessories",
          "Save it for vacation",
          "Ignore it when budgeting"
        ],
        answerIndex: 0,
        explanation:
          "Applying the stipend as a down payment reduces the amount you need to finance and lowers monthly payments."
      }
    ]
  },
  {
    id: "credit-health",
    title: "Unlock Better Rates with Strong Credit",
    category: "Credit",
    duration: "6 min lesson • 4 question quiz",
    points: 150,
    description:
      "Optimize your credit score to unlock the most competitive Toyota Financial Services student-friendly rates.",
    objectives: [
      "Learn how credit scores are calculated and why on-time payments matter",
      "Understand how co-signers can improve loan approval odds",
      "Build a 90-day action plan to level up your score before applying"
    ],
    quiz: [
      {
        id: "credit-health-q1",
        question: "What factor has the biggest impact on your credit score?",
        options: ["Credit inquiries", "Payment history", "Types of credit", "Age of credit history"],
        answerIndex: 1,
        explanation:
          "Payment history typically accounts for 35% of FICO scores, making on-time payments the most critical factor."
      },
      {
        id: "credit-health-q2",
        question:
          "You are new to credit and want a Toyota this fall. Which strategy helps most?",
        options: [
          "Opening several credit cards now",
          "Paying existing balances down and asking for a credit limit increase",
          "Closing your oldest credit card",
          "Ignoring credit until you apply"
        ],
        answerIndex: 1,
        explanation:
          "Lowering utilization and increasing limits reduces the percent of credit used, often boosting scores quickly."
      },
      {
        id: "credit-health-q3",
        question: "How can a co-signer help with Toyota Financial Services?",
        options: [
          "They guarantee free maintenance",
          "They split the down payment",
          "Their stronger credit profile can unlock better rates and approvals",
          "They eliminate the need for insurance"
        ],
        answerIndex: 2,
        explanation:
          "A co-signer with established credit can help secure lower rates by sharing responsibility for the loan."
      },
      {
        id: "credit-health-q4",
        question:
          "Which of the following is part of a healthy 90-day credit tune-up?",
        options: [
          "Missing one payment to focus on savings",
          "Keeping credit utilization below 30%",
          "Opening multiple store cards",
          "Canceling automatic payments"
        ],
        answerIndex: 1,
        explanation:
          "Utilizing less than 30% of your available credit shows responsible usage and positively impacts your score."
      }
    ]
  },
  {
    id: "ev-hybrid-basics",
    title: "Hybrid vs. EV: What Fits Your Commute?",
    category: "EV & Hybrid",
    duration: "4 min lesson • 3 question quiz",
    points: 100,
    description:
      "Compare Toyota's hybrid and all-electric lineup to pick the ride that best matches your campus commute and charging access.",
    objectives: [
      "Understand charging options for bZ4X owners living on or off campus",
      "Estimate savings from Toyota hybrid MPG advantages",
      "Match driving habits with the right electrified powertrain"
    ],
    quiz: [
      {
        id: "ev-hybrid-basics-q1",
        question:
          "You have limited charging on campus but drive 40 miles daily. Which Toyota is the easiest win?",
        options: [
          "bZ4X all-electric",
          "Prius Prime plug-in hybrid",
          "GR Supra",
          "Tacoma TRD Pro"
        ],
        answerIndex: 1,
        explanation:
          "Prius Prime offers 44 miles of EV range plus gas backup, making it flexible for limited charging."
      },
      {
        id: "ev-hybrid-basics-q2",
        question: "Which benefit is unique to Toyota hybrids like Corolla Hybrid?",
        options: [
          "Zero insurance cost",
          "Self-charging battery that never needs to plug in",
          "Free parking everywhere",
          "No maintenance required"
        ],
        answerIndex: 1,
        explanation:
          "Hybrid batteries recharge through regenerative braking, so you never have to plug them in."
      },
      {
        id: "ev-hybrid-basics-q3",
        question:
          "What incentives can students unlock by completing Toyota Financial learning paths?",
        options: [
          "Interest rate reductions and exclusive lease cash offers",
          "Free textbooks",
          "Unlimited car washes",
          "Automatic tuition discounts"
        ],
        answerIndex: 0,
        explanation:
          "The program rewards learners with special rate reductions, down payment matches, and loyalty incentives."
      }
    ]
  }
];

