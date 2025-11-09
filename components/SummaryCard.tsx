import Typo from "@/components/Typo";
import { colors, radius, spacingY } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

type SummaryCardProps = {
  title: string;
  value: string;
  color: string;
};

const SummaryCard = ({ title, value, color }: SummaryCardProps) => {
  return (
    <View style={styles.container}>
      <Typo size={16} color={colors.neutral400}>
        {title}
      </Typo>
      <Typo size={20} fontWeight="600" color={color}>
        {value}
      </Typo>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    padding: 20,
    borderRadius: radius._10,
    flex: 1,
    alignItems: "center",
    gap: spacingY._5,
    minHeight: 100, // Added minHeight to ensure consistent baseline
  },
});