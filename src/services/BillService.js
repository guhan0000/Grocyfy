import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, orderBy, query, Timestamp, writeBatch, doc } from 'firebase/firestore';

const BILLS_COLLECTION = 'bills';

export const saveBill = async (billData) => {
    try {
        const docRef = await addDoc(collection(db, BILLS_COLLECTION), {
            ...billData,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving bill: ", error);
        throw error;
    }
};

export const fetchBills = async () => {
    try {
        const q = query(collection(db, BILLS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
        }));
    } catch (error) {
        console.error("Error fetching bills: ", error);
        throw error;
    }
};

export const clearAllBills = async () => {
    try {
        const q = query(collection(db, BILLS_COLLECTION));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);

        querySnapshot.forEach((document) => {
            batch.delete(doc(db, BILLS_COLLECTION, document.id));
        });

        await batch.commit();
    } catch (error) {
        console.error("Error clearing bills: ", error);
        throw error;
    }
};
