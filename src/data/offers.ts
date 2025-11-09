export type Offer = {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  perk: string;
};

export const offers: Offer[] = [
  {
    id: "rate-boost",
    title: "Smart Student Rate Boost",
    description:
      "Knock 0.35% APR off Toyota Financial Services student-friendly finance rates when you finish your first two lessons.",
    pointsRequired: 200,
    perk: "0.35% APR reduction"
  },
  {
    id: "down-payment-match",
    title: "Down Payment Match",
    description:
      "Toyota matches up to $500 of your down payment after you reach 500 points and submit your savings plan.",
    pointsRequired: 500,
    perk: "Up to $500 Toyota match"
  },
  {
    id: "lease-credit",
    title: "Hybrid Lease Loyalty Credit",
    description:
      "Switch into a Toyota hybrid and receive $750 in lease cash alongside complimentary ToyotaCare maintenance.",
    pointsRequired: 750,
    perk: "$750 lease cash + ToyotaCare"
  },
  {
    id: "grad-bonus",
    title: "Graduation Fast Pass",
    description:
      "Seniors with 1,000 points unlock fast-track credit approval plus an extra year of roadside assistance.",
    pointsRequired: 1000,
    perk: "Fast approval + roadside assist"
  }
];

