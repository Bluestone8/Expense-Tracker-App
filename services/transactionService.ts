import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    if (transactionData.image) {
      const imageResponse = await uploadFileToCloudinary(
        transactionData.image,
        "transactions"
      );
      if (!imageResponse.success) {
        return { success: false, msg: "Failed to upload transaction image" };
      }
      transactionData.image = imageResponse.data;
    }

    const transactionRef = transactionData.id
      ? doc(firestore, "transactions", transactionData.id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    // update wallet balance
    const walletRef = doc(firestore, "wallets", transactionData.walletId!);
    const walletData = (await walletRef.get()).data();
    if (walletData) {
      let newAmount = walletData.amount;
      if (transactionData.type === "income") {
        newAmount += transactionData.amount;
      } else {
        newAmount -= transactionData.amount;
      }
      await updateDoc(walletRef, { amount: newAmount });
    }

    return { success: true, data: { ...transactionData, id: transactionRef.id } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transaction: TransactionType
): Promise<ResponseType> => {
  try {
    const transactionRef = doc(firestore, "transactions", transaction.id!);
    await deleteDoc(transactionRef);

    // update wallet balance
    const walletRef = doc(firestore, "wallets", transaction.walletId!);
    const walletData = (await walletRef.get()).data();
    if (walletData) {
      let newAmount = walletData.amount;
      if (transaction.type === "income") {
        newAmount -= transaction.amount;
      } else {
        newAmount += transaction.amount;
      }
      await updateDoc(walletRef, { amount: newAmount });
    }
    return { success: true, msg: "Transaction deleted successfully" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
