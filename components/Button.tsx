import { colors, radius } from "@/constants/theme";
import { CustomButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import Typo from "./Typo";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
  title,
  disabled,
  loadingColor = colors.white,
  ...props
}: CustomButtonProps) => {
  const isDisabled = loading || disabled;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, style, isDisabled && styles.disabledButton]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor} />
      ) : (
        <>
          {title && <Typo color={colors.white}>{title}</Typo>}
          {children}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: radius._17,
    backgroundColor: colors.primary,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.neutral600,
  },
});
