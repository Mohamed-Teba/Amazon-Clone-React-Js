import React, { useState } from 'react';
import { months, years } from "../constants";
import Stripe from 'stripe';
import { RotatingLines } from "react-loader-spinner";
import { useSelector } from 'react-redux';
import { useCart } from '../../context/userCartContext';

function CardDetails() {

    const product = useSelector((state) => state.amazon.buyNowProduct);
    if (product) {
        var productQty = product.quantity;
        var productPrice = product.price;
        var productTotalPrice = productPrice * productQty;
    }

    
    const { cartTotalPrice } = useCart();

    let deliveryCharges = 0;
    if ((productTotalPrice || cartTotalPrice) < 499) {
        deliveryCharges = 40;
    }

    const orderPrice = product ? (productTotalPrice + deliveryCharges) : (cartTotalPrice + deliveryCharges)

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiryMonth, setCardExpiryMonth] = useState('');
    const [cardExpiryYear, setCardExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardNumberError, setCardNumberError] = useState('');
    const [cardNameError, setCardNameError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cvvError, setCvvError] = useState('');

    const userInfo = useSelector((state) => state.amazon.userInfo);
    var userEmail = userInfo.email;

    const validate = () => {
        const reqName = /^[A-Za-z\s]+$/;
        const reqNumber = /^[0-9]{16}$/;
        const reqCvv = /^[0-9]{3}$/;
        let isValid = true;

        if (cardName === "") {
            setCardNameError("Please enter a name.");
            isValid = false;
        }
        if (cardName.length > 0) {
            if (!reqName.test(cardName)) {
                setCardNameError("Please enter a valid name.");
                isValid = false;
            }
        }
        if (cardNumber === "") {
            setCardNumberError("Please enter a 16 digit card number.");
            isValid = false;
        }
        if (cardNumber.length > 0) {
            if (!reqNumber.test(cardNumber)) {
                setCardNumberError("Please enter a valid card number.");
                isValid = false;
            }
        }
        if (cvv === "") {
            setCvvError("Please enter a CVV number.");
            isValid = false;
        }
        if (cvv.length > 0) {
            if (!reqCvv.test(cvv)) {
                setCvvError("Please enter a valid CVV number.");
                isValid = false;
            }
        }
        return isValid;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) {
            return;
        }
        setLoading(true);
        const stripe = new Stripe('sk_test_51Nnzd0SFIAKZeCgTARmB1PyzIxZat1QJTL7c7qozNVM3EB2tANl8gsrf6KN0ldUTlPh9gSomuBKPXP1ATscZx0ci002TyOjeIj');
        console.log(stripe.invoices)
        stripe.customers
            .create({
                email: userEmail,
                name: cardName,
            })
            .then((customer) => {
                return stripe.invoiceItems
                    .create({
                        customer: customer.id,
                        amount: orderPrice*100,
                        currency: 'inr',
                        description: 'One-time setup fee',
                    })
                    .then((invoiceItem) => {
                        return stripe.invoices.create({
                            collection_method: 'send_invoice',
                            customer: invoiceItem.customer,
                        });
                    })
                    .then((invoice) => {
                        return stripe.invoices.create({
                            collection_method: 'send_invoice',
                            customer: invoice.customer
                        })
                    })
                    .catch((err) => {
                    });
            });
    }

    return (
        <div className="w-[60%] mx-auto border-[1px] border-gray-400 rounded-lg ">
            <div className="w-full py-3 pl-5 border-b border-gray-400 rounded-tl-lg rounded-tr-lg bg-gray-100">
                <h1 className="text-lg font-semibold">Enter card details</h1>
            </div>
            <form onSubmit={handleSubmit} className='my-4 ml-10 flex flex-col gap-2'>
                <label className='font-semibold flex items-center gap-3'>
                    <span>Card number</span>
                    <input type="text" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value); setCardNumberError('') }} autoComplete="true" className='ml-[6px] border-[1px] border-[#a6a6a6] rounded p-1 w-56' />
                </label>
                {cardNumberError && <p className="text-red-700">{cardNumberError}</p>}
                <label className='font-semibold flex items-center gap-3'>
                    <span>Name on card</span>
                    <input type="text" value={cardName} onChange={(e) => { setCardName(e.target.value); setCardNameError('') }} autoComplete="true" className=' border-[1px] border-[#a6a6a6] rounded p-1 w-56' />
                </label>
                {cardNameError && <p className="text-red-500">{cardNameError}</p>}
                <div className="flex gap-5">
                    <label className='font-semibold flex items-center gap-3'>
                        <span>Expiry date</span>
                        <div className="flex gap-2">
                            <select className="border-[1px] border-[#a6a6a6] rounded p-1 ml-5" value={cardExpiryMonth} onChange={(e) => setCardExpiryMonth(e.target.value)}>
                                {months.map((month) => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <select className="border-[1px] border-[#a6a6a6] rounded p-1" value={cardExpiryYear} onChange={(e) => setCardExpiryYear(e.target.value)}>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </label>
                    <label className='font-semibold flex items-center gap-2'>
                        <span>CVV</span>
                        <input type="text" value={cvv} maxLength={3} onChange={(e) => { setCvv(e.target.value); setCvvError('') }} autoComplete="true" className=' w-10 border-[1px] border-[#a6a6a6] rounded p-1 ' />
                    </label>
                    {cvvError && <p className="text-red-500">{cvvError}</p>}
                </div>
                <button className="w-[58%] ml-28 text-center text-sm font-normal rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[7px] mt-3 active:ring-2 active:ring-offset-1 active:ring-blue-500">
                    Continue
                </button>

                {
                    loading && <div className='flex justify-center'>
                        <RotatingLines
                            strokeColor="#febd69"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="50"
                            visible={true}
                        />
                    </div>
                }
                <div className='hidden'>
                </div>

            </form>
        </div>
    )
}

export default CardDetails
