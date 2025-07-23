import React, { useEffect, useState } from "react";

function Slider({images}){
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const handleprevious=()=>{
        setCurrentIndex((prevIndex)=>
        prevIndex===0?images.length-1: prevIndex-1);
    }
    
    const handlenext=(()=> 
        setCurrentIndex((prevIndex)=>
        prevIndex===images.length-1?0: prevIndex+1
    )
    );

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentIndex((prevIndex)=>
            prevIndex===images.length-1?0: prevIndex+1)
        },3000);
        return()=>{
            clearInterval(interval);
        };
    },[images.length]);
    return(
        <>
            <div className="main flex relative">
                <div onClick={handleprevious} className="absolute w-[5%] h-full cursor-pointer">
                    <span className="absolute h-2/3 sml:text-[40px] pt-[100%] mdl:text-[80px] font-light border border-transparent active:border-black">&lt;</span>
                </div>

                <div>
                    <img className="sm:object-center" src={images[currentIndex]} alt="slider" />
                </div>
                <div onClick={handlenext} className="absolute ml-[96.4%] w-[5%] h-full cursor-pointer">
                    <span className="absolute h-2/3 sml:text-[40px] pt-[100%] mdl:text-[80px] font-light border border-transparent active:border-black">&gt;</span>
                </div>
            </div>
        </>
    )
}
export default Slider;