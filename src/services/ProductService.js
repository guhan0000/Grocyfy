import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const PRODUCTS_COLLECTION = 'products';

export const seedProducts = async () => {
    const dummyProducts = [
        { productName: 'Milk', price: 50, category: 'Dairy' },
        { productName: 'Bread', price: 40, category: 'Bakery' },
        { productName: 'Eggs', price: 60, category: 'Dairy' },
        { productName: 'Rice (1kg)', price: 80, category: 'Grains' },
        { productName: 'Sugar (1kg)', price: 45, category: 'Pantry' },
        { productName: 'Apple (1kg)', price: 120, category: 'Fruits' },
    ];

    for (const product of dummyProducts) {
        await addDoc(collection(db, PRODUCTS_COLLECTION), product);
    }
};

export const fetchProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching products: ", error);
        throw error;
    }
};

export const addProduct = async (product) => {
    try {
        const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
        return docRef.id;
    } catch (error) {
        console.error("Error adding product: ", error);
        throw error;
    }
};

export const updateProduct = async (id, updates) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating product: ", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting product: ", error);
        throw error;
    }
};
