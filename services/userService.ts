import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFile } from "./storageService";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  if (
    updateData.image &&
    typeof updateData.image === "object" &&
    updateData.image?.uri
  ) {
    const imageUrl = await uploadFile(
      updateData.image.uri,
      `users/${uid}/${Date.now()}`
    );
    updateData.image = imageUrl;
  }

  const userRef = doc(firestore, "users", uid);
  await updateDoc(userRef, updateData);

  return { success: true, msg: "User updated successfully" };
};
