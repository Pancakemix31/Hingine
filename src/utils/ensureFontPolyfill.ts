import ExpoFontLoader from "expo-font/build/ExpoFontLoader";

let hasPatched = false;

export const ensureFontPolyfill = () => {
  if (hasPatched) {
    return;
  }

  const loader = ExpoFontLoader as unknown as {
    getLoadedFonts?: () => string[];
  };

  if (typeof loader.getLoadedFonts !== "function") {
    console.warn(
      "[fonts] ExpoFontLoader.getLoadedFonts is unavailable. Applying polyfill for legacy Expo Go builds."
    );
    loader.getLoadedFonts = () => [];
  }

  hasPatched = true;
};

