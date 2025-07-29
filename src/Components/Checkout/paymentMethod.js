import React, { useState } from "react";
import { useAddress } from "../../context/userAddressContext";

const PaymentMethod = () => {
<<<<<<< HEAD
  // Access the updateSelectedPayment function from the userAddress context
  const { updateSelectedPayment } = useAddress();

  // State to hold the selected payment method
  const [setSelectedPaymentMethod] = useState(null);

  // Handle the selection of a payment method
  const handleSelectPaymentMethod = (event) => {
    setSelectedPaymentMethod(event.target.value); // Update local state
    updateSelectedPayment(event.target.value); // Update context with selected method
  };

  return (
    <div>
      {/* Section title */}
      <p className="text-lg font-semibold text-red-700 mt-3">
        2 &nbsp; Select a Payment Method
      </p>

      <div className="w-full flex justify-end">
        <div className="w-[96%] border-[1px] border-gray-400 rounded-lg mt-1 px-4 py-3">
          {/* Box title */}
          <p className="text-lg font-semibold border-b border-gray-400">
            Payment methods
          </p>

          {/* Payment method options */}
          <div className="flex flex-col gap-4 mt-2 font-semibold">
            {/* Credit/Debit Card option */}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="Credit/Debit Card"
                onChange={handleSelectPaymentMethod}
              />
              <span className="ml-2">Credit or debit card</span>
            </label>

            {/* UPI Apps option */}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="Upi Apps"
                onChange={handleSelectPaymentMethod}
              />
              <span className="ml-2">UPI Apps</span>
            </label>
=======
    const { updateSelectedPayment } = useAddress();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const handleSelectPaymentMethod = (event) => {
        setSelectedPaymentMethod(event.target.value);
        updateSelectedPayment(event.target.value);
    };
    
    return (
        <div>
            <p className="text-lg font-semibold text-red-700 mt-3">2 &nbsp; Select a Payment Method</p>
            <div className="w-full flex justify-end">
                <div className="w-[96%] border-[1px] border-gray-400 rounded-lg mt-1 px-4 py-3">
                    <p className="text-lg font-semibold border-b border-gray-400">Payment methods</p>
                    <div className="flex flex-col gap-4 mt-2 font-semibold">
                        <label className="inline-flex items-center">
                            <input type="radio" name="paymentMethod" value="Credit/Debit Card" onChange={handleSelectPaymentMethod} />
                            <span className="ml-2">Credit or debit card</span>
                        </label>
>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c

            {/* EMI option */}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="EMI"
                onChange={handleSelectPaymentMethod}
              />
              <span className="ml-2">EMI</span>
            </label>

            {/* Cash on Delivery option */}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash on Delivery"
                onChange={handleSelectPaymentMethod}
              />
              <span className="ml-2">Cash on Delivery/Pay on Delivery</span>
            </label>

            {/* Extra info note under Cash on Delivery */}
            <span className="ml-5 -mt-4 font-normal text-sm">
              Cash, UPI and Cards accepted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;

