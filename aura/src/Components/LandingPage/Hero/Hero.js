// import React from 'react';
// import './Hero.css' ;
// // import handicon from '../Assets/hand_icon';
// import arrow_icon from '../Assets/arrow_icon.png';
// import hero_image from '../Assets/hero_image.png';

// const Hero = () => {
//   return (
//     <div className='hero'>
//       <div className="hero-left">
//         <h2>New Arrivals Only</h2>
//         <div>
//             <div className="hero-hand-icon">
//                 <p>new</p>
                
//             </div>
//             <p>collections</p>
//             <p>for everyone</p>
//         </div>
//         <div className="hero-latest-btn">
//             <div>
//                 Latest Collections
//             </div>
//             <img src={arrow_icon} alt=""/>
//         </div>
//       </div>
//       <div className="div hero-right">
//       <img src={hero_image} alt="Hero" />
//       </div>
//     </div>

//   )
// }

// export default Hero

// Main Part for the Banner Images/Hero Images.
import React from 'react';
import './Hero.css';
import arrow_icon from '../../Assets/arrow_icon.png';
import hero_image1 from '../../Assets/hero_image1.png'; 
import hero_image2 from '../../Assets/hero_image2.png';
import hero_image3 from '../../Assets/hero_image3.png';
import hero_image4 from '../../Assets/hero_image4.png';
import hero_image5 from '../../Assets/hero_image5.png';
const Hero = () => {
    return (
      <div className="hero">
        <img src={hero_image1} alt="Fashion 1" />
        <img src={hero_image2} alt="Fashion 2" />
        <img src={hero_image3} alt="Fashion 3" />
        <img src={hero_image4} alt="Fashion 4" />
        <img src={hero_image5} alt="Fashion 5" />
      </div>
    );
  };
  
  export default Hero;
  
// const Hero = () => {
//   return (
//     <div className='hero'>
//       <div className="hero-section">
//         <img src={hero_image1} alt="Collection 1" />
//         <h2>Men's Collection</h2>
//       </div>
//       <div className="hero-section">
//         <img src={hero_image2} alt="Collection 2" />
//         <h2>Women's Collection</h2>
//       </div>
//       <div className="hero-section">
//         <img src={hero_image3} alt="Collection 3" />
//         <h2>Accessories</h2>
//       </div>
//       <div className="hero-section">
//         <img src={hero_image4} alt="Collection 3" />
//         <h2>Accessories</h2>
//       </div>
//       <div className="hero-section">
//         <img src={hero_image5} alt="Collection 3" />
//         <h2>Accessories</h2>
//       </div>
//     </div>
//   );
// }
// export default Hero;


