import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { uploadFile } from "./storageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  if (walletData.image) {
    const imageUrl = await uploadFile(
      walletData.image as string,
      `wallets/${walletData.userId}/${Date.now()}`
    );
    walletData.image = imageUrl;
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
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  const walletRef = doc(firestore, "wallets", walletId);
  await deleteDoc(walletRef);
  // delete all expenses associated with the wallet
  return { success: true, msg: "Wallet deleted successfully" };
};
