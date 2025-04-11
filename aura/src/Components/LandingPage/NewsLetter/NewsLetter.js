import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
      <h1>Unlock Exclusive Deals Via Your Email </h1>
      <p>Subscribe to our newletter and get updated! </p>
      <div>
        <input type="email" placeholder='Please Provide Your MailID' />
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default NewsLetter
