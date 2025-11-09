export type Car = {
  id: string;
  name: string;
  trim: string;
  msrp: number;
  monthlyFinance: number;
  monthlyLease: number;
  matchScore: number;
  mpg: string;
  imageUrl: string;
  highlight: string;
  tags: string[];
};
//ana abokk
//
export const cars: Car[] = [
  {
    id: "corolla-hybrid-2024",
    name: "Toyota Corolla Hybrid",
    trim: "LE AWD 2025",
    msrp: 24850,
    monthlyFinance: 329,
    monthlyLease: 259,
    matchScore: 92,
    mpg: "50 mpg combined",
    imageUrl:
      "https://global.toyota/pages/models/corolla-hybrid/2024/gallery/large/2024_corolla_hybrid_1.jpg",
    highlight: "Hybrid savings with Toyota Safety Sense 3.0 standard",
    tags: ["Hybrid", "Most Affordable", "Toyota Safety Sense"]
  },
  {
    id: "prius-prime-2024",
    name: "Toyota Prius Prime",
    trim: "SE Plug-in Hybrid",
    msrp: 32875,
    monthlyFinance: 419,
    monthlyLease: 329,
    matchScore: 88,
    mpg: "52 mpg hybrid / 44 mi EV",
    imageUrl: "https://global.toyota/pages/models/prius-prime/2024/gallery/2024_prius_prime_1.jpg",
    highlight: "Plug-in hybrid with EV-only commute range",
    tags: ["Plug-in", "Tech Focused", "CarPlay"]
  },
  {
    id: "camry-se-2025",
    name: "Toyota Camry",
    trim: "SE Nightshade AWD",
    msrp: 32495,
    monthlyFinance: 409,
    monthlyLease: 309,
    matchScore: 85,
    mpg: "28 / 39 mpg",
    imageUrl: "https://global.toyota/pages/models/camry/2025/gallery/2025_camry_1.jpg",
    highlight: "Sporty style with standard Toyota Safety Sense 3.0",
    tags: ["Sport", "All-Wheel Drive", "Top Seller"]
  },
  {
    id: "rav4-hybrid-2025",
    name: "Toyota RAV4 Hybrid",
    trim: "XLE Premium",
    msrp: 34870,
    monthlyFinance: 439,
    monthlyLease: 339,
    matchScore: 83,
    mpg: "41 mpg combined",
    imageUrl:
      "https://global.toyota/pages/models/rav4-hybrid/2025/gallery/2025_rav4_hybrid_1.jpg",
    highlight: "Compact SUV with hybrid efficiency for weekend getaways",
    tags: ["Hybrid", "Campus Life", "All-Wheel Drive"]
  },
  {
    id: "gr86-premium-2024",
    name: "Toyota GR86",
    trim: "Premium Manual",
    msrp: 31645,
    monthlyFinance: 429,
    monthlyLease: 369,
    matchScore: 72,
    mpg: "20 / 27 mpg",
    imageUrl: "https://global.toyota/pages/models/gr86/2024/gallery/2024_gr86_1.jpg",
    highlight: "Affordable performance coupe tuned with Gazoo Racing DNA",
    tags: ["Performance", "Manual", "Weekend Fun"]
  },
  {
    id: "grand-highlander-2025",
    name: "Toyota Grand Highlander",
    trim: "XLE Hybrid",
    msrp: 45975,
    monthlyFinance: 589,
    monthlyLease: 469,
    matchScore: 64,
    mpg: "36 mpg combined",
    imageUrl:
      "https://global.toyota/pages/models/grand-highlander/2025/gallery/2025_grand_highlander_1.jpg",
    highlight: "Three-row hybrid SUV ready for internships in other cities",
    tags: ["Family Trips", "Hybrid", "Road Trip"]
  },
  {
    id: "bz4x-xle-2024",
    name: "Toyota bZ4X",
    trim: "XLE AWD",
    msrp: 43895,
    monthlyFinance: 579,
    monthlyLease: 389,
    matchScore: 68,
    mpg: "252 mi EPA range",
    imageUrl: "https://global.toyota/pages/models/bz4x/2024/gallery/2024_bz4x_1.jpg",
    highlight: "All-electric SUV with zero tailpipe emissions",
    tags: ["EV", "Zero Emissions", "Tech Loaded"]
  }
];

