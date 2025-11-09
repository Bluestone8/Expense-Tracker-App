import Button from "@/components/Button";
import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import useFetchData from "@/components/useFetchData";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { TransactionType, WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: wallets,
    loading: walletsLoading,
    error: walletsError,
  } = useFetchData<WalletType>("wallets", [where("uid", "==", user?.uid)]);

  const {
    data: transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useFetchData<TransactionType>("transactions", [
    where("uid", "==", user?.uid),
  ]);

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    wallets.forEach((wallet) => {
      totalBalance += wallet.amount || 0;
    });

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    return { totalBalance, totalIncome, totalExpenses };
  }, [wallets, transactions]);

  const handleTransactionPress = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: { ...item, date: item.date.toString() },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} fontWeight="500" color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={22} fontWeight="500">
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass
              style={styles.searchIcon}
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <HomeCard
              totalBalance={totalBalance}
              income={totalIncome}
              expense={totalExpenses}
            />
          </View>

          <TransactionList
            title="Recent Transactions"
            data={transactions}
            loading={transactionsLoading}
            emptyListMessage="No transactions found"
            handleClick={handleTransactionPress}
          />
        </ScrollView>

        <Button
          style={styles.floatingButton}
          onPress={() => router.push("../(modals)/transactionModal")}
        >
          <Icons.Plus
            size={verticalScale(34)}
            color={colors.black}
            weight="bold"
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
