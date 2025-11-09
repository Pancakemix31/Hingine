import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import CarCard from "@/components/CarCard";
import { cars } from "@/data/cars";
import { useAppContext } from "@/context/AppContext";

const SWIPE_THRESHOLD = 120;
const SCREEN_WIDTH = Dimensions.get("window").width;

const SwipeScreen = () => {
  const { recordSwipe } = useAppContext();
  const [index, setIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const animatedCardStyle = useMemo(
    () => ({
      transform: [
        ...position.getTranslateTransform(),
        {
          rotate: position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ["-20deg", "0deg", "20deg"]
          })
        }
      ],
      opacity: position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [0.6, 1, 0.6]
      })
    }),
    [position]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderMove: (_, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe("right");
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe("left");
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true
            }).start();
          }
        }
      }),
    [position, index]
  );

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 });
  };

  const advanceCard = () => {
    setIndex((prev) => (prev + 1) % cars.length);
    resetPosition();
  };

  const forceSwipe = (direction: "left" | "right") => {
    const x = direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 240,
      useNativeDriver: true
    }).start(() => {
      const car = cars[index];
      recordSwipe(car.id, direction === "right" ? "like" : "skip");
      advanceCard();
    });
  };

  const currentCar = cars[index];
  const nextCar = cars[(index + 1) % cars.length];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Toyota Match Lab</Text>
        <Text style={styles.title}>
          Swipe into your next Toyota with financing that fits a student budget.
        </Text>
      </View>

      <View style={styles.swipeZone}>
        {nextCar ? (
          <Animated.View style={[styles.cardContainer, { transform: [{ scale: 0.94 }], opacity: 0.5 }]}>
            <CarCard car={nextCar} matchLabel={`${nextCar.matchScore}% match`} />
          </Animated.View>
        ) : null}

        {currentCar ? (
          <Animated.View style={[styles.cardContainer, animatedCardStyle]} {...panResponder.panHandlers}>
            <CarCard car={currentCar} matchLabel={`${currentCar.matchScore}% match`} />
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyHeadline}>You're all caught up!</Text>
            <Text style={styles.emptyCopy}>
              We’ll refresh Toyota pick lists with new inventory drops. In the meantime, check out your
              goals or take a lesson to unlock more offers.
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={advanceCard}>
              <Text style={styles.refreshButtonText}>See cars again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => forceSwipe("left")}
        >
          <Text style={[styles.actionLabel, styles.passLabel]}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.matchButton]}
          onPress={() => forceSwipe("right")}
        >
          <Text style={[styles.actionLabel, styles.matchLabel]}>Match</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 18,
    backgroundColor: "#f5f7fb"
  },
  header: {
    marginBottom: 16
  },
  eyebrow: {
    fontSize: 13,
    textTransform: "uppercase",
    color: "#ef2b2d",
    fontFamily: "Manrope_700Bold",
    letterSpacing: 1.2
  },
  title: {
    fontSize: 22,
    marginTop: 6,
    fontFamily: "Manrope_700Bold",
    color: "#0b1f3a"
  },
  swipeZone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24
  },
  cardContainer: {
    position: "absolute",
    width: "100%"
  },
  emptyState: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 }
  },
  emptyHeadline: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: "#0b1f3a",
    marginBottom: 12
  },
  emptyCopy: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: "#4c6072",
    textAlign: "center",
    marginBottom: 20
  },
  refreshButton: {
    backgroundColor: "#ef2b2d",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999
  },
  refreshButtonText: {
    color: "#fff",
    fontFamily: "Manrope_600SemiBold",
    fontSize: 15
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 24
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 16,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  passButton: {
    backgroundColor: "#ffffff"
  },
  matchButton: {
    backgroundColor: "#ef2b2d"
  },
  actionLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17
  },
  passLabel: {
    color: "#0b1f3a"
  },
  matchLabel: {
    color: "#ffffff"
  }
});

export default SwipeScreen;

