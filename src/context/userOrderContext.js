import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from 'react-redux';


const UserOrdersContext = createContext();

export const UserOrdersProvider = ({ children }) => {
    const [userOrders, setUserOrders] = useState([]);
    const userInfo = useSelector((state) => state.amazon.userInfo);
    const authenticated = useSelector((state) => state.amazon.isAuthenticated);

    useEffect(() => {
        if (authenticated && userInfo) {
            const getUserOrdersFromFirebase = async (userInfo) => {
                try {
                    const userOrdersRef = doc(collection(db, 'users', userInfo.email, 'orders'), userInfo.id);
                    const docSnapshot = await getDoc(userOrdersRef);
                    if (docSnapshot.exists()) {
                        setUserOrders(docSnapshot.data().orders);
                    } else {
                        setUserOrders([]);
                    }
                } catch (error) {
                    console.error('Error fetching user Orders data:', error);
                }
            };
            getUserOrdersFromFirebase(userInfo);
        } else {
            setUserOrders([]);
        }
    }, [authenticated, userInfo]);

    const updateUserOrders = (updatedOrders) => {
        setUserOrders(updatedOrders);
    };

    return (
        <UserOrdersContext.Provider value={{ userOrders, updateUserOrders }}>
            {children}
        </UserOrdersContext.Provider>
    );
};

export const useOrders = () => {
    return useContext(UserOrdersContext);
};