import React from 'react'
import FooterMiddlelist from './FooterMiddlelist'
import { middleList } from '../../constants'
import { logo } from '../../assets'


const FooterMiddle = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div>
            <div className='bg-slate-700 hover:bg-slate-600 text-white h-10'>
                <div className='w-36 text-sm py-2 mx-auto'>
                    <span className='cursor-pointer p-9' onClick={scrollToTop}>Back to top</span>
                </div>
            </div>
            <div className='w-full bg-amazon_light text-white'>
                <div className='w-full border-b-[1px] border-gray-500'>
                    <div className='max-w-5xl mx-auto text-gray-50'>
                        <div className='w-full px-10 py-10 gap-5 grid grid-cols-2 sml:grid-cols-3 lgl:grid-cols-4 place-items-center items-start'>
                            {
                                middleList.map((item) => (
                                    <FooterMiddlelist key={item.id}
                                        title={item.title}
                                        listItem={item.listItem} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='w-full flex gap-6 items-center justify-center py-6'>
                    <div>
                        <img className='w-20 pt-3' alt='' src={logo} />
                    </div>
                    <div className='flex gap-2'>
                        <p className='flex gap-1 items-center justify-center rounded-sm border border-gray-500 hover:border-amazon_yellow cursor-pointer duration-200 px-2 text-sm py-1'>English</p>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default FooterMiddle
