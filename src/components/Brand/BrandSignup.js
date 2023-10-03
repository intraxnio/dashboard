import React, { useState, useEffect } from 'react'
import sideImage from "../../images/banner2.jpg";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import logo from '../images/Intraxn-logo.svg';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  MenuItem,
  Select,
  InputLabel
  
} from '@mui/material';
import { toast } from "react-toastify";



function BrandSignup() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Art and Design');
  const [brandLogo, setBrandLogo] = useState('');


  async function submit(e) {
    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;

    if(!email || !emailRegex.test(email) || !password || !brand || !category){
      toast.warning("All fields are mandatory");
    }

    else{

      try {
        // const response = await axios.post("http://localhost:8000/api/v1/brand/signup-brand", {
          const response = await axios.post("https://app.buzzreach.in/api/v1/brand/signup-brand", {
          email: email,
          password: password,
          brand: brand,
          category: category,
        });
    
        if (response.data.success) {
          // Display success toast and navigate to login page
          toast.success("Account created successfully. Please login to continue...");
          navigate("/login/brand");
        } else {
          // Handle other errors or display a generic error toast
          toast.error("An error occurred. Please try again later.");
        }
      } catch (error) {
        if (error.response && error.response.data.error === "User already exists") {
          toast.warning("User already exists. Please login to continue...");
        }
        
        else if (error.response && error.response.data.error === "All fields are mandatory") {
          toast.warning("All fields are mandatory");
        }
         else {
          toast.error("An error occurred. Please try again later.");
        }
      }

    }
  
  
  }

  const loginButton = async () => {

    navigate("/login/brand");
    

  }
  
  

  return (
    <>
<Grid container spacing='2'>
  <Grid item xs={8}>
  
  <form action='#' method='post'>

      <Box 
      display='flex' 
      flexDirection={'column'} 
      maxWidth={450} 
      margin='auto'
      marginTop={10}
      padding={1}
      >
        <Typography variant='h5' padding={3} textAlign='center'>Brand Signup</Typography>

        <TextField type='email' id='email' onChange={(e)=>{setEmail(e.target.value)}} margin='normal' variant='outlined' label='Work Email'></TextField>
        <TextField type='password' id="password" onChange={(e)=>{setPassword(e.target.value)}} margin='normal' variant='outlined' label='Create a Password'></TextField>
        <TextField type='text' id="brandName" onChange={(e)=>{setBrand(e.target.value)}} margin='normal' variant='outlined' label='Brand Name'></TextField>
        {/* <InputLabel id="category-label">Category</InputLabel> */}
        <Select
        labelId="category-label"
        id="category-select"
        value={category}
        onChange={(e)=>{setCategory(e.target.value)}} >
        <MenuItem disabled value="">Select Category</MenuItem>
        <MenuItem value="Art and Design">Art and Design</MenuItem>
        <MenuItem value="Automotive">Automotive</MenuItem>
        <MenuItem value="Banking and Finance">Banking | Finance</MenuItem>
        <MenuItem value="Beauty and Cosmetics">Beauty & Cosmetics</MenuItem>
        <MenuItem value="Education and E-learning">Education & E-learning</MenuItem>
        <MenuItem value="Entertainment and Media">Entertainment & Media</MenuItem>
        <MenuItem value="Fashion">Fashion</MenuItem>
        <MenuItem value="Fitness and Gym">Fitness & Gym</MenuItem>
        <MenuItem value="Gaming">Gaming</MenuItem>
        <MenuItem value="Groceries">Groceries</MenuItem>
        <MenuItem value="Health and Wellness">Health & Wellness</MenuItem>
        <MenuItem value="Home and Decor">Home & Decor</MenuItem>
        <MenuItem value="Kitchen and Cooking">Kitchen | Cooking</MenuItem>
        <MenuItem value="Lifestyle">Lifestyle</MenuItem>
        <MenuItem value="Outdoor and Adventure">Outdoor & Adventure</MenuItem>
        <MenuItem value="Pets and Animals">Pets & Animals</MenuItem>
        <MenuItem value="Technology and Electronics">Technology & Electronics</MenuItem>
        <MenuItem value="Travel and Tourism">Travel & Tourism</MenuItem>
        {/* Add more MenuItem components for additional categories */}
      </Select>
        <Button type='submit' onClick={submit} variant='contained' 
                sx={{
                      marginTop:3,
                      textTransform:'capitalize',
                      fontWeight: '300',
                      fontSize: 16
                      }} 
                size='large'>Create Account</Button>

        <Typography variant='body2'>I agree to <Link href='#' underline='none'>Buzzreach's Terms of Service</Link></Typography>
        <Button variant='outlined' size='large' 
        sx={{
          marginTop:3,
          textTransform:'capitalize',
          fontWeight: '300',
          fontSize: 16
          }} 
          onClick={loginButton}
          >Already have account? Login here</Button>
      </Box>

      <ToastContainer autoClose={2000} />


      </form>
</Grid>
<Grid item xs={4}>
<img className="img-fluid" src={sideImage} alt="Passion into Profession" />
</Grid>
</Grid>
    </>
  )
}

export default BrandSignup