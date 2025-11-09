import { memo } from "react";
import { StyleSheet, View } from "react-native";

type ProgressBarProps = {
  progress: number; // 0 - 1
  color?: string;
  backgroundColor?: string;
  height?: number;
};

const ProgressBar = ({ progress, color = "#ff002b", backgroundColor = "#f2f3f5", height = 8 }: ProgressBarProps) => {
  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progress * 100))}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden"
  },
  fill: {
    height: "100%"
  }
});

export default memo(ProgressBar);

