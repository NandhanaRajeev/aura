import React from 'react'
import Hero from "../../Components/LandingPage/Hero/Hero";
import NewsLetter from '../../Components/LandingPage/NewsLetter/NewsLetter';
import CategoriesMain from "../../Components/LandingPage/CategoriesMain/CategoriesMain";
import LatestCollection from '../../Components/LandingPage/LatestCollections/LatestCollection';



// Main Page

const Women = () => {
  return (
    <>
    <div>
      <Hero />
      <CategoriesMain />
    </div>
    
    <div>
    <br />
      <LatestCollection />
    <br />
    <br />
    <br />
      <NewsLetter />
    </div>
    </>
  )
}

export default Women
