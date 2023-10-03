import React, { useState, useEffect } from 'react'
import sideImage from '../../images/banner2.jpg'
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
  Select
  
} from '@mui/material';
import { toast } from "react-toastify";



function CreatorSignup() {

  const navigate = useNavigate();
  // const { isAuthenticated } = useSelector((state) => state.user);

  // useEffect(() => {
  //   if(isAuthenticated === true){
  //     navigate("/");
  //   }
  // }, [])

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');

  
  async function submit(e) {

    e.preventDefault();

    try {

      await axios.post("http://localhost:8000/api/v1/creator/signup-creator", 
      { email: email, password: password, category: category }).then((res) => {
        console.log(res);
        toast.success("Login Success!");
        navigate("/login/creator");
      })
      .catch((err) => {
        // toast.error(err.response.data.message);
      });



    }
    catch (e) {
      console.log(e)

    }
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
      marginTop={15}
      padding={1}
      >
        <Typography variant='h5' padding={3} textAlign='center'>Influencer Signup</Typography>

        <TextField type='email' id='email' onChange={(e)=>{setEmail(e.target.value)}} margin='normal' variant='outlined' label='Work Email'></TextField>
        <TextField type='password' id="password" onChange={(e)=>{setPassword(e.target.value)}} margin='normal' variant='outlined' label='Create a Password'></TextField>
        <Select
        labelId="category-label"
        id="category-select"
        value={category}
        onChange={(e)=>{setCategory(e.target.value)}} >
        <MenuItem value="">Select Category</MenuItem>
        <MenuItem value="Actor">Actor</MenuItem>
        <MenuItem value="Artist">Artist</MenuItem>
        <MenuItem value="Automotive">Automotive</MenuItem>
        <MenuItem value="Baby or Kids">Baby | Kids</MenuItem>
        <MenuItem value="Bank or Finance">Banking | Finance</MenuItem>
        <MenuItem value="Beauty and Cosmetics">Beauty | Cosmetics</MenuItem>
        <MenuItem value="Blogger or Vlogger">Blogger | Vlogger</MenuItem>
        <MenuItem value="Digital Creator">Digital Creator</MenuItem>
        <MenuItem value="Education">Education | E-learning</MenuItem>
        <MenuItem value="Fashion Model">Fashion Model</MenuItem>
        <MenuItem value="Fitness and Gym">Fitness | Gym</MenuItem>
        <MenuItem value="Food Vlogger">Food Vlogger</MenuItem>
        <MenuItem value="Gamer">Gamer</MenuItem>
        <MenuItem value="Health and Wellness">Health | Wellness</MenuItem>
        <MenuItem value="Home and Decor">Home | Decor</MenuItem>
        <MenuItem value="Kitchen or Cooking">Kitchen | Cooking</MenuItem>
        <MenuItem value="Musician or Band">Musician | Band</MenuItem>
        <MenuItem value="Photographer">Photographer</MenuItem>
        <MenuItem value="Real Estate">Real Estate</MenuItem>
        <MenuItem value="Sports">Sports</MenuItem>
        <MenuItem value="Travel or Outdoor">Travel | Outdoor</MenuItem>
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
          >Already have account? Login here</Button>
      </Box>

      </form>
</Grid>
<Grid item xs={4}>
<img className="img-fluid" src={sideImage} alt="Passion into Profession" />
</Grid>
</Grid>
  

      {/* <Link ><a href="/" className="navbar-brand text-success" ><img src={logo} alt="intraxn" /></a></Link>
    
    <div className="row mx-auto">
    <div className="col-8 col-md-8 col-lg-8 form-styling-class">
        <div className="row w-50 mx-auto signup-text-styling mb-3">Signup</div>
        <form action="#" method='post'>
            <div className="row w-50 mb-4 mx-auto">
            <input type="email" onChange={(e)=>{setEmail(e.target.value)}} id="email" placeholder='Work Email' className="form-box-styling" />
            </div>
            <div className="row w-50 mb-4 mx-auto">
            <input type="password" onChange={(e)=>{setPassword(e.target.value)}} id="password" placeholder='Create a Password' className="form-box-styling"/>
            </div>
           
            <div className="row w-50 mx-auto">
            <button type="submit" onClick={submit} className="btn btn-primary form-box-styling">Create Account</button>
            </div>
            <div className="mx-auto w-50 mb-2">
            <label class="form-check-label" htmlFor="exampleCheck1">I agree to <Link to='/terms' className="text-decoration-none">Intraxn's Terms of Service</Link></label>
            </div>

            <div className="row w-50 mx-auto mt-5">
            <button type="submit" className="btn btn-outline-primary form-box-styling">Already have account? Login here</button>
            </div>
            
        </form>
    </div>


            <div className="col-4 col-md-4 col-lg-4 img-custom-class">
        <img className="img-fluid" src={sideImage} alt="Passion into Profession" />
               
            </div>
            </div>
     */}
    </>
  )
}

export default CreatorSignup