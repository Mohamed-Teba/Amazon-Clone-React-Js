import React from 'react'

const FooterMiddlelist = ({title,listItem}) => {
    return (
        
            <div>
                <h3 className='text-white text-base font-semibold pb-2'>{title}</h3>
                <ul className='flex flex-col gap-2'>
                   { listItem.map((item)=>item.listData.map((data,i)=>(
                    <li key={i} className='footerlink'>{data}</li>
                   )) )}
                </ul>
            </div>
           
        
    )
}

export default FooterMiddlelist
