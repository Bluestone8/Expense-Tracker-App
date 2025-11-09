import Typo from "@/components/Typo";
import { spacingY } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface SectionProps extends ViewProps {
  title: string;
}

const Section = ({ title, children, style }: SectionProps) => {
  return (
    <View style={[styles.container, style]}>
      <Typo size={20} fontWeight="600">
        {title}
      </Typo>
      {children}
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacingY._30,
  },
});