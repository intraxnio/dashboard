import React from 'react'
import axios from 'axios';
import BrandSideNavBar from './BrandSideNavBar';

function BrandDashboard() {


    async function submit(e) {

        e.preventDefault();
    
        try {
    
          await axios.post("/api/brand/dashboard");
    
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