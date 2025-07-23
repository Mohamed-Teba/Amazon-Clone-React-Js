import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useSelector } from 'react-redux';

const UserAddressContext = createContext();

export const UserAddressProvider = ({ children }) => {
    const [userAddress, setUserAddress] = useState([]);

    const userInfo = useSelector((state) => state.amazon.userInfo);
    const authenticated = useSelector((state) => state.amazon.isAuthenticated);

    const updateUserAddress = (updatedAddress) => {
        setUserAddress(updatedAddress);
    };

    useEffect(() => {
        if (authenticated && userInfo) {
            const getuserAddressesFromFirebase = async (userInfo) => {
                try {
                    const userAddressesRef = doc(collection(db, 'users', userInfo.email, 'shippingAddresses'), userInfo.id);

                    const docSnapshot = await getDoc(userAddressesRef);

                    if (docSnapshot.exists()) {
                        setUserAddress(docSnapshot.data().Addresses);
                    }
                } catch (error) {
                    console.error('Error fetching user address data:', error);
                }
            };
            getuserAddressesFromFirebase(userInfo);
        } else {
            setUserAddress([]);
        }
    }, [authenticated, userInfo]);

    const [selectedAddress, setSelectedAddress] = useState(null);

    const updateSelectedAddress = (updatedSelectedAddress) => {
        setSelectedAddress(updatedSelectedAddress);
    };

    const [selectedPayment, setSelectedPayment] = useState("");

    const updateSelectedPayment = (updatedSelectedPayment) => {
        setSelectedPayment(updatedSelectedPayment);
    };

    return (
        <UserAddressContext.Provider value={{ userAddress, updateUserAddress, selectedAddress, updateSelectedAddress, selectedPayment, updateSelectedPayment }}>
            {children}
        </UserAddressContext.Provider>
    );
}

export const useAddress = () => {
    return useContext(UserAddressContext);
};
