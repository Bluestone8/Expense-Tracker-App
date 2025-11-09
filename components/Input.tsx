import { colors, radius, spacingX } from "@/constants/theme";
import { InputProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Typo from "./Typo";

const Input = (props: InputProps) => {
  const { label, error, containerStyle, ...rest } = props;
  return (
    <View style={styles.mainContainer}>
      {label && <Typo style={styles.label}>{label}</Typo>}
      <View
        style={[
          styles.inputContainer,
          containerStyle,
          error && styles.errorContainer,
        ]}
      >
        {props.icon && props.icon}
        <TextInput
          style={[styles.input, props.inputStyle]}
          placeholder={props.placeholder}
          placeholderTextColor={colors.neutral400}
          ref={props.inputRef && props.inputRef}
          {...rest}
        />
      </View>
      {error && <Typo style={styles.errorText}>{error}</Typo>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  mainContainer: {
    gap: spacingX._8,
  },
  inputContainer: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14),
  },
  label: {
    color: colors.neutral300,
    fontSize: verticalScale(12),
  },
  errorContainer: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: verticalScale(12),
  },
});
