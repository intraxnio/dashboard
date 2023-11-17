import React from 'react'
import axios from 'axios';
// import SideNavBar from '../Creator/CreatorSideNavBar';
import BrandSideNavBar from './BrandSideNavBar';

function BrandDashboard() {


  //  const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";


  

    async function submit(e) {

        e.preventDefault();
    
        try {
    
          // await axios.post("http://localhost:8000/api/v1/brand/dashboard");
          await axios.post(baseUrl +"/brand/dashboard");
    
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