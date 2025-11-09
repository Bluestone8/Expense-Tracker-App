import { colors, radius, spacingY } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const Card = ({ children, style }: ViewProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    padding: 20,
    marginBottom: spacingY._20,
  },
});