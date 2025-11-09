import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/imageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const router = useRouter();

  const oldwallet = useLocalSearchParams() as {
    name?: string;
    image?: string;
    id?: string;
  };

  useEffect(() => {
    if (oldwallet?.id) {
      setWalletData({
        name: oldwallet.name || "",
        image: oldwallet.image || null,
      });
    }
  }, []);

  const [wallet, setWalletData] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    let { name, image } = wallet;
    if (!name.trim() && !image) {
      Alert.alert("Wallet Error", "Please enter wallet name and upload icon");
      return;
    }

    const data: WalletType = { name, image, uid: user?.uid };
    if (oldwallet?.id) {
      data.id = oldwallet.id;
    }

    const response = await createOrUpdateWallet(data);
    setLoading(false);
    console.log(response);
    if (response.success) {
      router.back();
    } else {
      Alert.alert("Wallet Error", response.msg || "Failed to create wallet");
    }
  };

  const onDelete = async () => {
    if (!oldwallet?.id) return;
    setLoading(true);
    const response = await deleteWallet(oldwallet?.id);
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
    console.log("Deleting wallet:", oldwallet?.id);
    // TODO: Implement wallet deletion service
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldwallet?.id ? "Update wallet" : "New wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              autoCapitalize="none"
              placeholder="Enter wallet name"
              value={wallet.name}
              onChangeText={(value: string) => {
                setWalletData({ ...wallet, name: value });
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            {/* Image input */}
            <ImageUpload
              file={wallet.image}
              onSelect={(file) => setWalletData({ ...wallet, image: file })}
              placeholder="Upload Wallet Icon"
              onClear={() => setWalletData({ ...wallet, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      {/* footer */}
      <View style={styles.footer}>
        {oldwallet?.id && !loading && (
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
            {oldwallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: verticalScale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    width: verticalScale(135),
    height: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._5,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
