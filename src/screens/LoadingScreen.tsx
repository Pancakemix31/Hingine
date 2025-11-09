import { ReactNode } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type LoadingScreenProps = {
  onDrive: () => void;
  footerSlot?: ReactNode;
};

const LoadingScreen = ({ onDrive, footerSlot }: LoadingScreenProps) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.brandLockup}>
        <Text style={styles.brandPrefix}>Toyota</Text>
        <Text style={styles.brandAccent}>MATCH</Text>
      </View>
      <Text style={styles.title}>Start your Toyota match.</Text>
      <Text style={styles.copy}>Tap Drive to answer a few quick questions and unlock the full experience.</Text>

      <TouchableOpacity style={styles.driveButton} activeOpacity={0.9} onPress={onDrive}>
        <Text style={styles.driveLabel}>Drive</Text>
      </TouchableOpacity>

      {footerSlot}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb"
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 36,
    justifyContent: "center",
    alignItems: "center"
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  brandPrefix: {
    fontSize: 13,
    textTransform: "uppercase",
    color: "#ef2b2d",
    fontFamily: "Manrope_700Bold",
    letterSpacing: 1.2,
    marginRight: 6
  },
  brandAccent: {
    fontSize: 15,
    fontFamily: "Manrope_600SemiBold",
    color: "#ef2b2d",
    fontStyle: "italic",
    letterSpacing: 1.6,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 30,
    fontFamily: "Manrope_700Bold",
    color: "#0b1f3a",
    textAlign: "center",
    marginBottom: 12
  },
  copy: {
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
    color: "#4c6072",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32
  },
  driveButton: {
    backgroundColor: "#ef2b2d",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    marginBottom: 16
  },
  driveLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#ffffff",
    letterSpacing: 0.4
  }
});

export default LoadingScreen;

