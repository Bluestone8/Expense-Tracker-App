import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {
    if (
      updateData.image &&
      typeof updateData.image === "object" &&
      updateData.image?.uri
    ) {
      const imageResponse = await uploadFileToCloudinary(
        updateData.image,
        "users"
      );
      if (!imageResponse.success) {
        return { success: false, msg: "Failed to upload image" };
      }
      updateData.image = imageResponse.data;
    }

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updateData);

    return { success: true, msg: "User updated successfully" };
  } catch (error: any) {
    return { success: false, msg: "Failed to update user" };
  }
};
