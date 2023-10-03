import React from 'react'
import axios from 'axios';
import SideNavBar from '../Creator/CreatorSideNavBar';
import BrandSideNavBar from './BrandSideNavBar';

function BrandDashboard() {

    async function submit(e) {

        e.preventDefault();
    
        try {
    
          // await axios.post("http://localhost:8000/api/v1/brand/dashboard");
          await axios.post("https://app.buzzreach.in/api/v1/brand/dashboard");
    
        }
        catch (e) {
          console.log(e)
    
        }
      }

  return (
    <>
    <BrandSideNavBar/> 
    </>
  )
}

export default BrandDashboard