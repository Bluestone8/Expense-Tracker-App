import { HeaderProps } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";

const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>{leftIcon}</View>
      <View style={styles.titleContainer}>
        {title && (
          <Typo size={22} fontWeight="600" style={styles.title}>
            {title}
          </Typo>
        )}
      </View>
      <View style={styles.iconContainer}>{rightIcon}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 3,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
});
