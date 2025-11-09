import Card from "@/components/Card";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import SummaryCard from "@/components/SummaryCard";
import TransactionItem from "@/components/TransactionItem";
import Typo from "@/components/Typo";
import useFetchData from "@/components/useFetchData";
import { expenseCategories } from "@/constants/data";
import { colors, radius, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { TransactionType, WalletType } from "@/types";
import * as Haptics from "expo-haptics";
import { where } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

type TimePeriod = "week" | "month" | "year";

const Statistics = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const { data: transactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", [
      where("uid", "==", user?.uid),
    ]);

  const { data: wallets, loading: walletsLoading } = useFetchData<WalletType>(
    "wallets",
    [where("uid", "==", user?.uid)]
  );

  const {
    pieData,
    barData,
    totalIncome,
    totalExpenses,
    totalBalance,
    listData,
  } = useMemo(() => {
    const { totalIncome, totalExpenses, categoryTotals } = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
          if (transaction.category) {
            if (acc.categoryTotals[transaction.category]) {
              acc.categoryTotals[transaction.category] += transaction.amount;
            } else {
              acc.categoryTotals[transaction.category] = transaction.amount;
            }
          }
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, categoryTotals: {} }
    );

    const totalBalance = wallets.reduce(
      (acc, wallet) => acc + (wallet.amount || 0),
      0
    );

    const pieData = Object.keys(categoryTotals).map((category) => {
      const categoryData =
        expenseCategories[category.toLowerCase()] ||
        expenseCategories["default"];
      return {
        value: categoryTotals[category],
        color: categoryData.bgColor,
        text: categoryData.label,
        icon: categoryData.icon,
      };
    });

    const barData = [
      {
        value: totalIncome,
        label: "Income",
        frontColor: colors.success,
        topLabelComponent: () => (
          <Typo color={colors.white} fontWeight="600">
            ${totalIncome.toFixed(2)}
          </Typo>
        ),
      },
      {
        value: totalExpenses,
        label: "Expenses",
        frontColor: colors.danger,
        topLabelComponent: () => (
          <Typo color={colors.white} fontWeight="600">
            ${totalExpenses.toFixed(2)}
          </Typo>
        ),
      },
    ];

    const recentTransactions = transactions.slice(0, 5);
    const topSpendingCategories = pieData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const listData = [
      { type: "header", title: "Top Spending Categories" },
      ...topSpendingCategories.map((item) => ({ ...item, type: "category" })),
      { type: "header", title: "Recent Transactions" },
      ...recentTransactions.map((item) => ({ ...item, type: "transaction" })),
    ];

    return {
      pieData,
      barData,
      totalIncome,
      totalExpenses,
      totalBalance,
      listData,
    };
  }, [transactions, wallets, timePeriod]);

  if (transactionsLoading || walletsLoading) {
    return (
      <ScreenWrapper>
        <Loading />
      </ScreenWrapper>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item.type === "category") {
      return (
        <View style={styles.categoryItem}>
          <View style={styles.categoryInfo}>
            <item.icon size={30} color={item.color} />
            <Typo size={18} fontWeight="600" style={{ marginLeft: 15 }}>
              {item.text}
            </Typo>
          </View>
          <View style={styles.categoryAmount}>
            <Typo size={18} fontWeight="700">
              ${item.value.toFixed(2)}
            </Typo>
          </View>
        </View>
      );
    }

    if (item.type === "transaction") {
      return (
        <TransactionItem item={item} index={index} handleClick={() => {}} />
      );
    }

    if (item.type === "header") {
      return (
        <Typo size={22} fontWeight="700" style={styles.sectionTitle}>
          {item.title}
        </Typo>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper>
      <View style={styles.filterContainer}>
        {(["week", "month", "year"] as TimePeriod[]).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.filterButton,
              timePeriod === period && styles.activeFilter,
            ]}
            onPress={() => {
              setTimePeriod(period);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Typo
              fontWeight="600"
              color={timePeriod === period ? colors.white : colors.neutral400}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Typo>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={listData}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <View style={styles.summaryContainer}>
              <SummaryCard
                title="Total"
                value={`$${totalBalance.toFixed(1)}`}
                color={colors.primary}
              />
              <SummaryCard
                title="Income"
                value={`$${totalIncome.toFixed(1)}`}
                color={colors.success}
              />
              <SummaryCard
                title="Expenses"
                value={`$${totalExpenses.toFixed(1)}`}
                color={colors.danger}
              />
            </View>
            <Card>
              <Typo size={22} fontWeight="700" style={styles.sectionTitle}>
                Income vs Expenses
              </Typo>
              <View style={styles.chartContainer}>
                <BarChart
                  data={barData}
                  barWidth={60}
                  spacing={80}
                  initialSpacing={20}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  showYAxisIndices={false}
                  showXAxisIndices={false}
                  barStyle={{
                    borderTopLeftRadius: radius._10,
                    borderTopRightRadius: radius._10,
                  }}
                  gradientColor={colors.white}
                />
              </View>
            </Card>
            <Card>
              <Typo size={22} fontWeight="700" style={styles.sectionTitle}>
                Expense Categories
              </Typo>
              <View style={styles.chartContainer}>
                {pieData.length > 0 ? (
                  <PieChart
                    data={pieData}
                    donut
                    innerRadius={90}
                    radius={160}
                    centerLabelComponent={() => (
                      <View style={styles.centerLabel}>
                        <Typo size={22} fontWeight="700">
                          Total
                        </Typo>
                        <Typo size={20} fontWeight="600" color={colors.danger}>
                          ${totalExpenses.toFixed(2)}
                        </Typo>
                      </View>
                    )}
                    sectionAutoFocus
                    focusOnPress
                    onPress={(item) => console.log(item)}
                    shadowColor={colors.neutral400}
                    shadowWidth={2}
                  />
                ) : (
                  <Typo>No data to display</Typo>
                )}
              </View>
            </Card>
          </>
        }
      />
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral700,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderRadius: radius._15,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: spacingY._20,
  },
  sectionTitle: {
    marginBottom: spacingY._20,
  },
  chartContainer: {
    alignItems: "center",
    marginTop: spacingY._20,
  },
  centerLabel: {
    alignItems: "center",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    padding: 15,
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryAmount: {
    alignItems: "flex-end",
  },
  screenTitle: {
    textAlign: "center",
    marginTop: spacingY._20,
    marginBottom: spacingY._20,
  },
});
