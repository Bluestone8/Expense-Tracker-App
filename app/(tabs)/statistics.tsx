import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Section from "@/components/Section";
import SummaryCard from "@/components/SummaryCard";
import TransactionItem from "@/components/TransactionItem";
import Typo from "@/components/Typo";
import useFetchData from "@/components/useFetchData";
import { expenseCategories } from "@/constants/data";
import { colors, radius, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { TransactionType, WalletType } from "@/types";
import { where } from "firebase/firestore";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

type TimePeriod = "week" | "month" | "year";

const Statistics = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

  const { data: transactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", [
      where("uid", "==", user?.uid),
    ]);

  const { data: wallets, loading: walletsLoading } =
    useFetchData<WalletType>("wallets", [where("uid", "==", user?.uid)]);

  const {
    pieData,
    barData,
    totalIncome,
    totalExpenses,
    totalBalance,
    recentTransactions,
    topSpendingCategories,
  } = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalBalance = 0;
    const categoryTotals: { [key: string]: number } = {};

    wallets.forEach((wallet) => {
      totalBalance += wallet.amount || 0;
    });

    const now = new Date();
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date as any);
      if (timePeriod === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactionDate > weekAgo;
      } else if (timePeriod === "month") {
        return transactionDate.getMonth() === now.getMonth();
      } else if (timePeriod === "year") {
        return transactionDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
        if (transaction.category) {
          if (categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] += transaction.amount;
          } else {
            categoryTotals[transaction.category] = transaction.amount;
          }
        }
      }
    });

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
          <Typo color={colors.white}>${totalIncome.toFixed(2)}</Typo>
        ),
      },
      {
        value: totalExpenses,
        label: "Expenses",
        frontColor: colors.danger,
        topLabelComponent: () => (
          <Typo color={colors.white}>${totalExpenses.toFixed(2)}</Typo>
        ),
      },
    ];

    const recentTransactions = filteredTransactions.slice(0, 5);
    const topSpendingCategories = pieData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      pieData,
      barData,
      totalIncome,
      totalExpenses,
      totalBalance,
      recentTransactions,
      topSpendingCategories,
    };
  }, [transactions, wallets, timePeriod]);

  if (transactionsLoading || walletsLoading) {
    return (
      <ScreenWrapper>
        <Header title="Statistics" />
        <Loading />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Statistics" />
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
              color={timePeriod === period ? colors.white : colors.neutral400}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Typo>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Total Balance"
            value={`$${totalBalance.toFixed(2)}`}
            color={colors.primary}
          />
          <SummaryCard
            title="Income"
            value={`$${totalIncome.toFixed(2)}`}
            color={colors.success}
          />
          <SummaryCard
            title="Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            color={colors.danger}
          />
        </View>
        <Section title="Income vs Expenses">
          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              barWidth={50}
              spacing={60}
              initialSpacing={20}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              showYAxisIndices={false}
              showXAxisIndices={false}
            />
          </View>
        </Section>
        <Section title="Expense Categories">
          <View style={styles.chartContainer}>
            {pieData.length > 0 ? (
              <PieChart
                data={pieData}
                donut
                innerRadius={80}
                radius={150}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Typo size={20} fontWeight="600">
                      Total
                    </Typo>
                    <Typo size={18} fontWeight="500" color={colors.danger}>
                      ${totalExpenses.toFixed(2)}
                    </Typo>
                  </View>
                )}
              />
            ) : (
              <Typo>No data to display</Typo>
            )}
          </View>
        </Section>
        <Section title="Top Spending Categories">
          <FlatList
            data={topSpendingCategories}
            keyExtractor={(item) => item.text}
            renderItem={({ item }) => (
              <View style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <item.icon size={24} color={item.color} />
                  <Typo size={16} style={{ marginLeft: 10 }}>
                    {item.text}
                  </Typo>
                </View>
                <View style={styles.categoryAmount}>
                  <Typo size={16} fontWeight="600">
                    ${item.value.toFixed(2)}
                  </Typo>
                </View>
              </View>
            )}
          />
        </Section>
        <Section title="Recent Transactions">
          <FlatList
            data={recentTransactions}
            keyExtractor={(item) => item.id!}
            renderItem={({ item, index }) => (
              <TransactionItem
                item={item}
                index={index}
                handleClick={() => {}}
              />
            )}
          />
        </Section>
      </ScrollView>
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral700,
  },
  filterButton: {
    padding: 10,
  },
  activeFilter: {
    backgroundColor: colors.primary,
    borderRadius: radius._10,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 10,
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
    marginVertical: 10,
    backgroundColor: colors.neutral800,
    padding: 15,
    borderRadius: radius._10,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryAmount: {
    alignItems: "flex-end",
  },
});
