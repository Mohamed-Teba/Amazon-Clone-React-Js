import React from 'react';
import Slider from './Slider';
import { bannerImgOne, bannerImgTwo, bannerImgThree, bannerImgFour, bannerImgFive} from "../assets/assets/index"
import Category from './Category';
import ProductsSlider from './productSlider';
import { ScrollRestoration } from 'react-router-dom';

const Home = () => {
    const sampleImage = [
        bannerImgOne,
        bannerImgTwo,
        bannerImgThree,
        bannerImgFour,
        bannerImgFive
    ]
    return (
        <div>
            <Slider images={sampleImage} />
            <div className='sml:-mt-28 mdl:-mt-60' ><Category /></div>
            <div><ProductsSlider /></div>
            <ScrollRestoration />
        </div>
    )
}

export default Home