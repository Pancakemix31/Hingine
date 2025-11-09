import "react-native-gesture-handler";
import "react-native-reanimated";

import { useEffect } from "react";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Platform, View } from "react-native";

import { AppProvider } from "@/context/AppContext";
import { ensureFontPolyfill } from "@/utils/ensureFontPolyfill";
import OffersScreen from "@/screens/OffersScreen";
import LearnScreen from "@/screens/LearnScreen";
import GoalsScreen from "@/screens/GoalsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import SwipeScreen from "@/screens/SwipeScreen";

const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f5f7fb"
  }
};

const App = () => {
  ensureFontPolyfill();

  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold
  });

  useEffect(() => {
    if (fontError) {
      console.error("Failed to load custom fonts. Falling back to system defaults.", fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#ef2b2d" />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={Platform.OS === "ios" ? "dark" : "light"} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: "#ef2b2d",
            tabBarLabelStyle: {
              fontFamily: "Manrope_600SemiBold",
              fontSize: 12
            },
            tabBarStyle: {
              height: 74,
              paddingBottom: 12,
              paddingTop: 8
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "ellipse";
              if (route.name === "Match") iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
              if (route.name === "Learn") iconName = focused ? "book" : "book-outline";
              if (route.name === "Rewards") iconName = focused ? "gift" : "gift-outline";
              if (route.name === "Goals") iconName = focused ? "flag" : "flag-outline";
              if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          })}
        >
          <Tab.Screen name="Match" component={SwipeScreen} />
          <Tab.Screen name="Learn" component={LearnScreen} />
          <Tab.Screen name="Rewards" component={OffersScreen} />
          <Tab.Screen name="Goals" component={GoalsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;

