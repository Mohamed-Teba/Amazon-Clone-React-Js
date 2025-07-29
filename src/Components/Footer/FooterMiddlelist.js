import React from "react";

<<<<<<< HEAD
// FooterMiddlelist component receives title and listItem as props
const FooterMiddlelist = ({ title, listItem }) => {
  return (
    <div>
      {/* Section title */}
      <h3 className="text-white text-base font-semibold pb-2">{title}</h3>

      {/* Unordered list of links under each title */}
      <ul className="flex flex-col gap-2">
        {
          // Looping over the listItem array, and then mapping through each listData inside it
          listItem.map((item) =>
            item.listData.map((data, i) => (
              <li key={i} className="footerlink">
                {data}
              </li>
            ))
          )
        }
      </ul>
    </div>
  );
};

export default FooterMiddlelist;
=======
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



>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c
