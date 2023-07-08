import { collection, doc, getDocs,setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { createId } from '@paralleldrive/cuid2';

export const getUserData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "User"));
        const promises = querySnapshot.docs.map((doc) => {
            return new Promise((resolve, reject) => {
                resolve(doc.data());
            });
        })
        const result = await Promise.all(promises);
        if (result && result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error getting user data:", e);
    }
}

  export const setUserData = async (data) => {
    try {
      let userId = data.id; // Assuming your custom ID field is called 'id'

      if (!userId) {
        userId = createId();
        data.id = userId;
      }

      const userRef = doc(db,"User",userId + '');
  
      // Set the user data with the provided ID, merging the new data with existing fields
      await setDoc(userRef, data, { merge: true });
      console.log("User data upserted successfully!");
  
      return data;
    } catch (e) {
      console.error("Error setting user data: ", e);
      return null;
    }
  };