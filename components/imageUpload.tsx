import { colors, radius } from "@/constants/theme";
import { ImageUploadProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

const getFilePath = (file: any) => {
  if (file && typeof file === "string") return { uri: file };
  if (file && typeof file === "object" && file.uri) return { uri: file.uri };
  return require("@/assets/images/defaultAvatar.png");
};

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "Upload Image",
}: ImageUploadProps) => {
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please grant permission to access the photo library."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        onSelect(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "An error occurred while picking the image.");
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.inputContainer, containerStyle]}
        >
          <Icons.UploadSimple color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}
      {file && (
        <View style={[styles.image, imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
            <Icons.XCircle
              color={colors.white}
              size={verticalScale(24)}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    flexDirection: "row",
    borderColor: colors.neutral200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._10,
    gap: 10,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  image: {
    width: scale(150),
    height: scale(150),
    borderRadius: radius._15,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: colors.neutral700,
    borderRadius: radius._10,
    padding: 5,
  },
});
