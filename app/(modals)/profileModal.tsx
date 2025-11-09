import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import ImageUpload from "@/components/imageUpload";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { updateUser } from "@/services/userService";
import { UserDataType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    let { name } = userData;
    if (name === "") {
      Alert.alert("Please enter your name");
      return;
    }
    setLoading(true);
    // Only send fields that should be updated; omit image if it's null
    const dataToUpdate: any = { name };
    if (userData.image !== null) {
      dataToUpdate.image = userData.image;
    }
    const response = await updateUser(user?.uid as string, dataToUpdate);
    setLoading(false);
    if (response.success) {
      await updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("Error", response.msg || "Failed to update profile");
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <ImageUpload
            file={userData.image}
            onSelect={(file) => setUserData({ ...userData, image: file })}
            onClear={() => setUserData({ ...userData, image: null })}
          />
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              autoCapitalize="none"
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(value: string) => {
                setUserData({ ...userData, name: value });
              }}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo size={18} fontWeight="700" color={colors.black}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

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
  inputContainer: {
    gap: spacingY._10,
  },
});
