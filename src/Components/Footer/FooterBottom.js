import React from 'react'
import { BottomList } from '../../constants'

const FooterBottom = () => {
  return (
    <div className='w-full bg-footerBottom'>
      <div className='w-full px-10 border-b-[1px] border-gray-500'>
                    <div className='max-w-5xl mx-auto text-gray-50'>
                        <div className='w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-start'>
          {
                            BottomList.map((item)=>(
                               <div className='text-white hover:underline mt-4' key={item.id}>
                                <p className='text-xs text-gray-200 font-semibold'>{item.title}</p>
                                <p className='text-xs text-gray-300 w-28 '>{item.desc}</p>
                                </div> 
                            ))
                        }
        </div>
        <div className="flex justify-evenly w-80 m-auto mt-5">
          <a href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_desktop_footer_cou?ie=UTF8&nodeId=200545940" className="text-gray-300 text-xs font-medium hover:underline">Conditions of use
          </a>
          <a href="https://www.amazon.in/gp/help/customer/display.html/ref=ap_desktop_footer_privacy_notice?ie=UTF8&nodeId=200534380"
            className="text-gray-300 text-xs font-medium  hover:underline">Privacy Notice
          </a>
          <a href="https://www.amazon.in/gp/help/customer/display.html?ie=UTF8&nodeId=508510"
            className="text-gray-300 text-xs font-medium  hover:underline">Internet-Based Ads
          </a>
        </div>
        <div className="sm:ml-[20%] md:ml-[37%] text-xs mt-3 text-gray-300">© 1996-2023, Amazon.com, Inc. or its affiliates</div>
      </div>
      </div>
    </div>
  )
}

export default FooterBottom
