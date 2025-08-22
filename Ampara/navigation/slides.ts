import { ImageSourcePropType } from "react-native";

export type Slide = {
  key: string;
  title: string;
  body: string;
  color: string;
  illustration?: ImageSourcePropType;
  onArrive?: "askNotifications";
  primaryCta?: { label: string; action: "goCreateElder" };
  secondaryCta?: { label: string; action: "openTerms" };
};

export const SLIDES: Slide[] = [
  {
    key: "welcome",
    title: "Welcome to Ampara",
    body: "We create company for your loved ones",
    color: "#FCD34D",
    illustration: require("../assets/Ampara_logo.png"),
  },
  {
    key: "promise",
    title: "Care that stays close",
    body: "Ampara helps families support older adults with simple check-ins, shared updates, and gentle reminders.",
    color: "#FBBF24",
    illustration: require("../assets/onboarding/promise.png"),
  },
  {
    key: "checkins",
    title: "Never miss a check-in",
    body: "Schedule calls, get smart nudges, and keep a simple call history.",
    color: "#F59E0B",
    illustration: require("../assets/onboarding/checkins.png"),
    onArrive: "askNotifications",
  },
  {
    key: "mood",
    title: "Spot changes early",
    body: "Log moods, notes, and concerns. See gentle trends so you can act sooner.",
    color: "#fa9f2f",
    illustration: require("../assets/onboarding/mood.png"),
  },
  {
    key: "family",
    title: "One place for the family",
    body: "Share updates, tasks, and appointments so everyone’s on the same page.",
    color: "#6B7280",
    illustration: require("../assets/onboarding/family.png"),
  },
  {
    key: "privacy",
    title: "Your data, your rules",
    body: "Private by default. You choose what to share and with whom.",
    color: "#5C6265",
    illustration: require("../assets/onboarding/privacy.png"),
    primaryCta: { label: "Get started", action: "goCreateElder" },
    secondaryCta: { label: "Learn more", action: "openTerms" },
  },
  {
    key: "",
    title: "",
    body: "",
    color: "#ffffff",
    illustration: require("../assets/Ampara_logo.png"),
  },
];
