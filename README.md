# Hingine — Toyota Financial Hackathon MVP

Hingine is a student-first mobile experience that helps campus shoppers swipe, learn, and earn their way toward the right Toyota. The MVP runs on Expo (React Native) and is optimized for iPhone simulators/devices.

## Overview

- **Match Lab** — Tinder-style swipe deck for Toyota vehicles with student-friendly financing highlights.
- **Learn Tab** — Financial literacy micro-lessons with quizzes that award points toward incentives.
- **Rewards Wallet** — Unlock Toyota Financial Services perks (rate boosts, lease cash, down-payment matches).
- **Dream Garage** — Track goals, savings milestones, and target vehicles.
- **Profile Hub** — Manage personal details, saved vehicles, and financial snapshots.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npm run start
   ```
3. Press `i` in the Expo CLI to launch the iOS simulator or scan the QR code with the Expo Go app on your iPhone.

> **Note:** Metro bundler needs the native Expo environment. Ensure you have Xcode command-line tools installed to run the iOS simulator.

## Tech Stack

- Expo 51 / React Native 0.74
- React Navigation (bottom tabs)
- Context API for lightweight state management
- Animated swipe gestures for the car matching deck

## Next Steps

- Hook in Toyota Financial Services APIs when available.
- Persist user progress with Expo Secure Store or backend services.
- Add OAuth / student verification for personalized offers.

