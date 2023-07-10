import {addDoc,collection,doc,getDocs, setDoc, query, where, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../config/firebase.js';
import {getStartAndEndDate} from '../utils/index.js';
import {createId} from '@paralleldrive/cuid2';

export const addTransaction = async(data) => {
  try {

    if(!data.id) {
      data.id = createId();
    }

    const transactionsRef = collection(db, "Transactions");
    const querySnapshot = await getDocs(transactionsRef);

    // Check if the provided id already exists in any transaction document
    const idAlreadyExists = querySnapshot.docs.some(
      (doc) => doc.data().id === data.id
    );

    if (idAlreadyExists) {
      console.log(`Transaction with id ${data.id} already exists. Skipping...`);
    } else {
      console.log("Adding transaction");
      await setDoc(doc(transactionsRef, data.id),data);
      return data;
    }
  } catch (error) {
      console.error("Error adding document:", error);
  }
}

export const getTransactions = async (monthStartDay, month, year) => {
  try {
      const dateObj = getStartAndEndDate(monthStartDay, month, year);

      const transactionRef = collection(db, "Transactions");
      const q = query(
          transactionRef,
          where("createdAt", ">=", dateObj.startDate),
          where("createdAt", "<", dateObj.endDate)
      );
      const querySnapshot = await getDocs(q);

      const promises = querySnapshot.docs.map((doc) => {
          return new Promise((resolve, reject) => {
              if (doc.data().isDeleted === 0) {
                  resolve(doc.data());
              } else {
                  resolve({});
              }
          });
      });

      const results = await Promise.all(promises);

      return results;
  } catch (error) {
      console.error("Error getting transactions: ", error);
      return null;
  }
};

export const updateTransaction = async (data,id) => {
  try {
    const transactionRef = doc(db, "Transactions",id);
    const transactionSnapshot = await getDoc(transactionRef);

    if(transactionSnapshot.exists()) {
      await setDoc(transactionRef,data);
      return data;
    } else {
      console.error("Transaction does not exist");
      return null;
    }
    
  } catch (e) {
    console.error("Error while updating transaction:",e);
    return null;
  }
}

export const deleteTransaction = async(id) => {
  try {
    const transactionRef = doc(db, "Transactions", id);
    const transactionSnapshot = await getDoc(transactionRef);

    if (transactionSnapshot.exists()){
        await updateDoc(transactionRef, {"isDeleted":1});
        return id;
    } else {
      console.log("Cannot delete transaction");
      return null;
    }

  } catch (e) {
    console.error("Error while updating transaction:",e);
    return null;
  }
}

