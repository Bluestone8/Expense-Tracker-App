import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/imageUpload";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { deleteWallet } from "@/services/walletService";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const TransactionModal = () => {
  const { user, updateUserData } = useAuth();
  const router = useRouter();

  const oldTransaction = useLocalSearchParams() as {
    name?: string;
    image?: string;
    id?: string;
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: "expense",
        amount: 0,
        category: oldTransaction.name || "",
        date: new Date(),
        description: "",
        walletId: "",
        image: oldTransaction.image || null,
      });
    }
  }, []);

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    category: "",
    date: new Date(),
    description: "",
    walletId: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isCategoryFocus, setIsCategoryFocus] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    let { category, image } = transaction;
    if (!category && !image) {
      Alert.alert("Transaction Error", "Please enter category and upload icon");
      return;
    }

    const data: TransactionType = { ...transaction, uid: user?.uid };
    if (oldTransaction?.id) {
      data.id = oldTransaction.id;
    }

    try {
      // TODO: Implement transaction service
      console.log("Creating/Updating transaction:", data);
      const response = { success: true };
      setLoading(false);
      console.log(response);
      if (response.success) {
        router.back();
      } else {
        Alert.alert("Transaction Error", "Failed to create transaction");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Transaction Error", "An error occurred");
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const response = await deleteWallet(oldTransaction?.id);
    setLoading(false);
    console.log(response);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Wallet Error", response.msg || "Failed to delete wallet");
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Delete Wallet",
      "Are you sure you want to delete this wallet?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            onDelete();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteWallet = async () => {
    console.log("Deleting wallet:", oldTransaction?.id);
    // TODO: Implement wallet deletion service
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update transaction" : "New transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Type</Typo>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setIsFocus(!isFocus)}
            >
              <Text style={styles.dropdownSelectedText}>
                {transaction.type === "income" ? "Income" : "Expense"}
              </Text>
              <Icons.CaretDown
                size={16}
                color={colors.neutral300}
                weight="bold"
              />
            </TouchableOpacity>
            {isFocus && (
              <View style={styles.dropdownListContainer}>
                <TouchableOpacity
                  style={styles.dropdownItemContainer}
                  onPress={() => {
                    setTransaction({ ...transaction, type: "income" });
                    setIsFocus(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItemContainer}
                  onPress={() => {
                    setTransaction({ ...transaction, type: "expense" });
                    setIsFocus(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Expense</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Category</Typo>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setIsCategoryFocus(!isCategoryFocus)}
            >
              <Text style={styles.dropdownSelectedText}>
                {transaction.category
                  ? expenseCategories[
                      transaction.category as keyof typeof expenseCategories
                    ]?.label || "Select Category"
                  : "Select Category"}
              </Text>
              <Icons.CaretDown
                size={16}
                color={colors.neutral300}
                weight="bold"
              />
            </TouchableOpacity>
            {isCategoryFocus && (
              <View style={styles.dropdownListContainer}>
                {Object.entries(expenseCategories).map(([key, category]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.dropdownItemContainer}
                    onPress={() => {
                      setTransaction({ ...transaction, category: key });
                      setIsCategoryFocus(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Icon</Typo>
            {/* Image input */}
            <ImageUpload
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Upload Icon"
              onClear={() => setTransaction({ ...transaction, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              size={verticalScale(24)}
              color={colors.white}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo size={18} fontWeight="700" color={colors.black}>
            {oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androifDropDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
});
