import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FooterTop = () => {

  const userInfo = useSelector((state) => state.amazon.userInfo);
  return (
    <>
      {!userInfo &&
        <div className='w-full bg-white py-6'>
          <div className='w-full border-t-[1px] border-b-[1px] py-8'>
            <div className='w-64 mx-auto text-center flex flex-col gap-1'>
              <p className='text-sm'>See Personalised Recommendation</p>
              <Link to="/Login">
                <button className='w-60 ml-3 h-8 text-sm bg-yellow-400 rounded-md py-1 font-semibold cursor-pointer'>
                  Sign in
                </button>
              </Link>
              <p className='text-xs'>New Customer?{""}
                <Link to='/SignUp'><span className='text-green-600 ml-1 cursor-pointer'>Start here.</span></Link>
              </p>
            </div>
          </div>
        </div>
      }
    </>

  )
}

export default FooterTop
