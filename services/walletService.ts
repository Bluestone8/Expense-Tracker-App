import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    if (walletData.image) {
      const imageResponse = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageResponse.success) {
        return { success: false, msg: "Failed to upload wallet icon" };
      }
      walletData.image = imageResponse.data;
    }

    if (!walletData?.id) {
      walletData.amount = 0;
      walletData.totalIncome = 0;
      walletData.totalExpenses = 0;
      walletData.createdAt = new Date();
    }

    const walletRef = walletData.id
      ? doc(firestore, "wallets", walletData.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletData, { merge: true });
    return { success: true, data: { ...walletData, id: walletRef.id } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);
    // delete all expenses associated with the wallet
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
