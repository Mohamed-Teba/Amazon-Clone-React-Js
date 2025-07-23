import React, { useState } from 'react';
import { info, exclamation } from '../../assets';
import { getAuth, updateProfile, sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { RotatingLines } from "react-loader-spinner";


const SignUp = () => {

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const auth = getAuth();

    const [firebaseError, setFirebaseError] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [mobileNumber, setMobileNumber] = useState('');
    const [errorMobile, setErrorMobile] = useState('');

    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const saveUserDataToFirebase = async (user) => {
        const userDetailsRef = doc(collection(db, "users", user.email, "details"), user.uid);
        const userDetailsSnapshot = await getDoc(userDetailsRef);
        if (!userDetailsSnapshot.exists()) {
            await setDoc(userDetailsRef, {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                mobile: user.phoneNumber,
                createdOn: new Date(),
            }, { merge: true });
        }
    }


    const emailValidation = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
    };

    const validate = () => {
        const reqpassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        let isvalid = true;
        if (!inputValue) {
            setErrorMessage("Enter Name");
            isvalid = false;
        }
        if (email) {
            if (!emailValidation(email)) {
                setErrorEmail("Enter a valid email");
                isvalid = false;
            }
        }
        if (mobileNumber.length < 10) {
            setErrorMobile("Enter a valid Mobile Number");
            isvalid = false;
        }
        if (!password) {
            setErrorPassword("Enter your password");
            isvalid = false;

        } else {
            if (password.length < 6 || !reqpassword.test(password)) {
                setErrorPassword("Passwords must be at least 6 characters");
                isvalid = false;

            }
        }
        return isvalid;
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setErrorMessage("");
    };

    const handleMobileNumber = (e) => {
        setMobileNumber(e.target.value);
        setErrorMobile("");
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
        setErrorEmail("");
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
        setErrorPassword("");
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const isvalid = validate();
        if (!isvalid) {
            return;
        }
        setLoading(true);
        if (email && password) {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    updateProfile(auth.currentUser, {
                        displayName: inputValue,
                        photoURL: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp",
                    })
                    const user = userCredential.user;
                    saveUserDataToFirebase(user);
                    sendEmailVerification(auth.currentUser);
                    setLoading(false);
                    setSuccessMsg("Account Created Successfully");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode.includes("auth/email-already-in-use")) {
                        setFirebaseError("Email is already in use ! Try another one");
                    }
                });
        }
        setInputValue("");
        setMobileNumber("");
        setEmail("");
        setPassword("");

    }
    return (
        <div className="flex flex-col w-full h-auto">
            <Link to='/'><img className='m-auto w-52' alt='' src="https://api.freelogodesign.org/assets/blog/img/20180911090509731amazon_logo_RGB.jpg" />
            </Link>

            <div className="border border-1 border-gray-300 w-96 rounded-md m-auto h-auto px-4 py-4">

                <span className='text-3xl font-normal'>Create Account</span>
                {
                    successMsg ?
                        <div className='mt-3'>
                            <li className='text-base font-semibold text-green-600 ' >
                                Account Created Successfully!
                            </li >
                            <li className='text-base font-semibold ' >
                                We've sent you a Verification Email
                            </li >
                            <li className='text-base font-semibold text-red-600 ' >
                                Please Verify Your Email to avoid Data Loss!
                            </li >
                        </div > :
                        <form className='mt-3 text-xs font-bold mb-4 flex flex-col gap-4' onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-1 h-auto'>Your Name
                                <input type='text' value={inputValue} onChange={handleInputChange} className='border border-gray-400 rounded-sm h-7 font-normal p-2' placeholder='First and Last Name' />
                                {errorMessage &&
                                    <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                                        <img className='w-4 text-red-500' src={exclamation} alt='info' />
                                        <p>{errorMessage}</p>
                                    </div>
                                }
                            </div>
                            <div className='flex flex-col gap-1'>Mobile number (optional)
                                <span>
                                    <select className='font-medium rounded-sm border border-gray-400 h-7'>
                                        <option>IN +91</option>
                                    </select>
                                    <input type='tel' maxLength={10} value={mobileNumber} onChange={handleMobileNumber} className='ml-4 border border-gray-400 h-7 w-[78%] rounded-sm font-normal p-2' placeholder='Mobile Number' />
                                </span>
                                {errorMobile &&
                                    <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                                        <img className='w-4 text-red-500' src={exclamation} alt='info' />
                                        <p>{errorMobile}</p>
                                    </div>
                                }
                            </div>
                            <div className='flex flex-col'>Email
                                <input type='text' value={email} onChange={handleEmail} className='border border-gray-400 rounded-sm h-7 font-normal p-2' />
                                {(errorEmail || firebaseError) &&
                                    <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                                        <img className='w-4 text-red-500' src={exclamation} alt='info' />
                                        <p>{errorEmail || firebaseError}</p>
                                    </div>
                                }
                            </div>
                            <div className='flex flex-col'>Password
                                <input type='password' value={password} onChange={handlePassword} className='border border-gray-400 rounded-sm h-7 font-normal p-2' placeholder='At least 6 characters' />
                                {errorPassword &&
                                    <div className="text-xs font-normal italic text-red-500 pl-2 flex flex-row">
                                        <img className='w-4 text-red-500' src={exclamation} alt='info' />
                                        <p>{errorPassword}</p>
                                    </div>
                                }
                                <span className='flex items-center'>
                                    <img className='w-3 h-4' src={info} alt='info' />
                                    <p className='pl-1 font-normal'>Password must be atleast 6 characters.</p>
                                </span>
                                <p className='mt-4 font-normal text-sm'>By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Amazon. Message and data rates may apply.</p>
                            </div>
                            <button type='submit' className='bg-yellow-300 p-2 rounded-md font-medium tracking-wide'>Continue</button>
                            <div id="recaptcha-container"></div>
                            {
                                loading && <div className='flex justify-center '>
                                    <RotatingLines
                                        strokeColor="orange"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        width="50"
                                        visible={true}
                                    />
                                </div>
                            }
                        </form>
                }
                <Link to='/Login'>
                    <p className='text-xs tracking-wider mt-4'>Already have an account?
                        <span className='text-blue-700 font-medium hover:text-red-600 hover:underline cursor-pointer'>Sign in<span className='text-blue-500 -ml-1 hover:text-red-600'><ArrowRightIcon /></span>
                        </span>
                    </p>
                </Link>
                <p className='text-xs tracking-wider'>Buying for work?
                    <span className='text-blue-700 hover:text-red-600 font-medium hover:underline cursor-pointer'>Create a free business account
                        <span className='text-blue-500 -ml-1 hover:text-red-600'><ArrowRightIcon /></span>
                    </span>
                </p>
                <p className='text-xs tracking-wider mt-5'>By Creating or logging in, you agree to Amazon's<span className='text-blue-700 font-medium hover:text-red-600 hover:underline cursor-pointer'> Conditions of Use</span> and<span className='text-blue-700 hover:text-red-600 hover:underline font-medium cursor-pointer'> Privacy Policy.</span> </p>
            </div>

            <hr className="block mt-8 m-auto w-80" />
            <div className="flex justify-evenly w-80 m-auto mt-5">
                <a href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_desktop_footer_cou?ie=UTF8&nodeId=200545940" className=" text-blue-700 text-xs font-medium hover:text-red-600 hover:underline">Conditions of use
                </a>
                <a href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_desktop_footer_privacy_notice?ie=UTF8&nodeId=200534380"
                    className="text-blue-700 text-xs font-medium hover:text-red-600 hover:underline">Privacy Notice
                </a>
                <a href="https://www.amazon.in/gp/help/customer/display.html?ie=UTF8&nodeId=508510"
                    className="text-blue-700 text-xs font-medium hover:text-red-600 hover:underline">Help
                </a>
            </div>
            <div className="mx-auto text-xs mt-3">© 1996-2023, Amazon.com, Inc. or its affiliates</div>
        </div>
    )
}

export default SignUp
