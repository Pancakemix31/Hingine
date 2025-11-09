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
      "https://platform.cstatic-images.com/xxlarge/in/v2/16a89a71-4928-5633-9453-88c621eebd94/4298ed2f-e276-4caa-87d8-f183e6f6add7/mfhCTXp8_oIcS7XVKxHYA_2A_wk.jpg",
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
    imageUrl: "https://pictures.dealer.com/t/toyotarichardsonvtg/0265/791740324841a6a7e45a921e3504c046x.jpg?impolicy=resize&w=1024",
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
    imageUrl: "https://pictures.dealer.com/t/toyotarichardsonvtg/1884/95afddcae85466860d7e498deeb09d5ax.jpg?impolicy=resize&w=1024",
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
      "https://pictures.dealer.com/t/toyotarichardsonvtg/1684/e66028d3f3a9771d79f1e3d9916449dcx.jpg?impolicy=resize&w=1024",
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
    imageUrl: "https://pictures.dealer.com/t/toyotarichardsonvtg/1035/459b264f55cebfd9d97070d10364e624x.jpg?impolicy=resize&w=1024",
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
      "https://pictures.dealer.com/t/toyotarichardsonvtg/0869/de2ffb9409edaf91e2e4f16e7b5677fdx.jpg?impolicy=resize&w=1024",
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
    imageUrl: "https://images2.autotrader.com/hn/c/8f6fd04eb5294ea2aeaa12b0f8dc9f2c.jpg?format=auto&width=488&height=366&format=auto&width=800&height=600",
    highlight: "All-electric SUV with zero tailpipe emissions",
    tags: ["EV", "Zero Emissions", "Tech Loaded"]
  }
];

