import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadFile } from "./storageService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  if (transactionData.image) {
    const imageUrl = await uploadFile(
      transactionData.image as string,
      `transactions/${transactionData.walletId}/${Date.now()}`
    );
    transactionData.image = imageUrl;
  }

  const transactionRef = transactionData.id
    ? doc(firestore, "transactions", transactionData.id)
    : doc(collection(firestore, "transactions"));

  await setDoc(transactionRef, transactionData, { merge: true });

  // update wallet balance
  const walletRef = doc(firestore, "wallets", transactionData.walletId!);
  const walletSnap = await getDoc(walletRef);
  const walletData = walletSnap.data();
  if (walletData) {
    let newAmount = walletData.amount;
    if (transactionData.type === "income") {
      newAmount += transactionData.amount;
    } else {
      newAmount -= transactionData.amount;
    }
    await updateDoc(walletRef, { amount: newAmount });
  }

  return {
    success: true,
    data: { ...transactionData, id: transactionRef.id },
  };
};

export const deleteTransaction = async (
  transaction: TransactionType
): Promise<ResponseType> => {
  const transactionRef = doc(firestore, "transactions", transaction.id!);
  await deleteDoc(transactionRef);

  // update wallet balance
  const walletRef = doc(firestore, "wallets", transaction.walletId!);
  const walletSnap = await getDoc(walletRef);
  const walletData = walletSnap.data();
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
};
