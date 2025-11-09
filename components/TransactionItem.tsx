import Typo from "@/components/Typo";
import { expenseCategories } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionItemProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category = expenseCategories[item.category?.toLowerCase() || "default"];
  if (!category) {
    category = expenseCategories["default"];
  }
  const IconComponent = category.icon;
  return (
    <Animated.View entering={FadeInDown.delay(index * 70)}>
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent size={verticalScale(25)} color={colors.white} />
          )}
        </View>
        <View style={styles.categoryDes}>
          <Typo size={17} fontWeight="500">
            {category.label}
          </Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item.description}
          </Typo>
        </View>
        <View style={styles.amountDate}>
          <Typo
            fontWeight="500"
            color={item.type === "income" ? colors.success : colors.danger}
          >
            {item.type === "income" ? "+" : "-"}$
            {item.amount.toFixed(2)}
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            {new Date(item.date as any).toLocaleDateString()}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    gap: 3,
    alignItems: "flex-end",
  },
});