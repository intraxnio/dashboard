import React, { useState, useEffect, useCallback } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
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
  Rating, 
  Avatar, 
  Stack, ClickAwayListener, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, InputLabel, FormControl
} from '@mui/material';
import { toast } from "react-toastify";
import sideImage from "../../images/IMG_1025.jpg";
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';






function BrandSignup() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brand, setBrand] = useState('');
  const [handle, setHandle] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [allCategories, setAllCategories] = useState([ ]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // const baseUrl = "http://localhost:8000/api";
  



  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  const handleInputChange = (e) => {
    setHandle(e.target.value);
    setIsFocused(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    if (handle === '') {
      setIsFocused(false);
    }
  };

  async function submit(e) {
    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;

    if(!email || !password || !brand ){
      toast.warning("All fields are mandatory");
    }

    else if(!emailRegex.test(email)){
      toast.warning("Invalid email address");
    }

    else{

      setIsLoading(true);

      try {
          const response = await axios.post("/api/brand/signup-brand", {
          email: email,
          password: password,
          brand: brand,
        });
    
        if (response.data.success) {
          setIsLoading(false);
          setIsDialogOpen(true);

        } else {
          // Handle other errors or display a generic error toast
          setIsLoading(false);
          toast.error("An error occurred. Please try again later.");
        }
      

      } catch (error) {
        if (error.response && error.response.data.error === "User already exists") {
          setIsLoading(false);
          toast.warning("User already exists. Please login to continue...");
        }
        
        else if (error.response && error.response.data.error === "All fields are mandatory") {
          setIsLoading(false);
          toast.warning("All fields are mandatory");
        }
         else {
          setIsLoading(false);
          toast.error("Technical Error. Please try again later.");
        }
      }

    }
  
  
  }

  const checkPin = async (e) => {
    e.preventDefault();

    if(!emailCode){
        toast.warning("Enter valid 6-digit Pin");
      }

      else {


      await axios.post("/api/brand/check-resetPin-withDb-brandTemps",
        { email: email.toLowerCase(), pin : emailCode },
        {withCredentials: true}
      )
      .then((res) => {

            setLoading(true);

            if(!res.data.matching){
                setLoading(false);
                toast.error("Invalid Pin");

            }
            else if(res.data.matching){
                
                setLoading(false);
                setIsDialogOpen(false);
                toast.success("Account created successfully. Please login to continue...");

                setTimeout(() => {
                  navigate("/");
                }, 2000);
                  }

      })
      .catch((err) => {

        if (err.response && err.response.data.error === "User does not exists!") {
          toast.warning("User does not exists");
        } 

        else if (err.response && err.response.data.error === "email, password mismatch") {
          toast.warning("Invalid email or password");
        } 
        
        else {
          toast.error("An error occurred. Please try again later.");
        }
      });

    }

    
  };

  const loginButton = async () => {

    navigate("/login/brand");
    

  }
  
  

  return (
    <>
{/* <Grid container spacing='2'> */}

{isSmallScreen ? (

<Grid item xs={12} paddingX ={2}>
<form action='#' method='post'>


{isLoading ? (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
 <CircularProgress color= 'success' />
</div>
) : ( <>

      <Box 
      display='flex' 
      flexDirection={'column'} 
      maxWidth={450} 
      margin='auto'
      marginTop={12}
      >
        <Typography variant='h5' textAlign='center' sx={{ marginBottom : '22px'}}>Brand Signup</Typography>

        <TextField type='email' id='email' sx={{ marginBottom : '12px'}} onChange={(e)=>{setEmail(e.target.value)}} variant='outlined' label='Email'></TextField>
        <TextField type='password' id="password"  sx={{ marginBottom : '12px'}} onChange={(e)=>{setPassword(e.target.value)}} variant='outlined' label='Create a Password'></TextField>
        <TextField type='text' id="brandName" sx={{ marginBottom : '12px'}} onChange={(e)=>{setBrand(e.target.value)}} variant='outlined' label='Brand Name'></TextField>

        <Button type='submit' onClick={submit} variant='contained' 
                sx={{
                      marginTop:3,
                      textTransform:'capitalize',
                      fontWeight: '300',
                      fontSize: 16,
                      background: '#362FD9'
                      }} 
                size='large'>Create Account</Button>

<Typography variant="body2" sx={{marginTop : '5px'}}>
                I agree to{" "}
                <Link href="https://billsbook.cloud/terms-conditions" target="_blank" underline="none" sx={{color: '#362FD9'}}>
                  BillsBook's Terms of Service
                </Link>
              </Typography>
          <Button variant='outlined' size='large' 
        sx={{
          marginTop:3,
          textTransform:'capitalize',
          fontWeight: '300',
          fontSize: 16,
          fontWeight: "400",
          color: '#362FD9'

          }} 
          onClick={loginButton}
          >Already have an account? Login here</Button>
      </Box>

      </>)}

      <ToastContainer autoClose={2000} />


      </form>

</Grid> ): (

<Grid container spacing="1" sx={{ height: '100vh' }}>



<Grid item xs={4} sx={{ background: '#362FD9' }}>

              <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
              
               >
                      
              <Typography textAlign="start"  sx={{
                fontSize: '46px', 
                fontWeight: '500', 
                color: 'white', 
                paddingX: '20px', 
                paddingTop: '25%',

                }}>
                Welcome to our community.
              </Typography>

              <Typography textAlign="start"  sx={{fontSize: '22px', color: 'white', paddingX: '20px', paddingTop: '3%'}}>
               Unlock new horizons for unparalleled business and growth.
              </Typography>

              </Box>


                <Box
                  display="flex"
                  flexDirection={"column"}
                  margin="auto"
                  padding={1}
                  sx={{ marginTop : '20%'}}
                >
                    
                <Rating
                sx={{ paddingX : '20px'}} 
                name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />

<Typography textAlign="start"  sx={{fontSize: '14px', color: 'white', paddingX: '20px', paddingTop: '2%'}}>
                "It's a game-changing invoicing tool that streamlines payment collection like never before, 
                offering solutions that many small business owners didn't even realize they needed until now."
                </Typography>


                <Stack 
                display="flex"
                flexDirection={'row'}
                padding={1}
                sx={{marginTop : '5%', paddingX: '20px'}}
                >

                {/* <Avatar alt="Travis Howard" src={''} sx={{ width: 40, height: 40 }}/> */}
                <Box 
                display ='flex'
                flexDirection={'column'}
                >
                <Typography textAlign="start"  sx={{fontSize: '14px', color: 'white'}}>
                Karan Jaiswal <br />
                </Typography>

                <Typography textAlign="start"  sx={{fontSize: '12px', color: '#E4F1FF'}}>
                Founder, Cribstore
                </Typography>
                </Box>

                

                </Stack>



                </Box>




        </Grid>

  <Grid item xs={8}>
  
  <form action='#' method='post'>


{isLoading ? (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
 <CircularProgress color= 'success' />
</div>
) : ( <>

      <Box 
      display='flex' 
      flexDirection={'column'} 
      maxWidth={450} 
      margin='auto'
      marginTop={12}
      >
        <Typography variant='h5' textAlign='center' sx={{ marginBottom : '22px'}}>Brand Signup</Typography>

        <TextField type='email' id='email' sx={{ marginBottom : '12px'}} onChange={(e)=>{setEmail(e.target.value)}} variant='outlined' label='Email'></TextField>
        <TextField type='password' id="password"  sx={{ marginBottom : '12px'}} onChange={(e)=>{setPassword(e.target.value)}} variant='outlined' label='Create a Password'></TextField>
        <TextField type='text' id="brandName" sx={{ marginBottom : '12px'}} onChange={(e)=>{setBrand(e.target.value)}} variant='outlined' label='Brand Name'></TextField>

        <Button type='submit' onClick={submit} variant='contained' 
                sx={{
                      marginTop:3,
                      textTransform:'capitalize',
                      fontWeight: '300',
                      fontSize: 16,
                      background: '#362FD9'
                      }} 
                size='large'>Create Account</Button>

<Typography variant="body2" sx={{marginTop : '5px'}}>
                I agree to{" "}
                <Link href="https://billsbook.cloud/terms-conditions" target="_blank" underline="none" sx={{color: '#362FD9'}}>
                  BillsBook's Terms of Service
                </Link>
              </Typography>
          <Button variant='outlined' size='large' 
        sx={{
          marginTop:3,
          textTransform:'capitalize',
          fontWeight: '300',
          fontSize: 16,
          fontWeight: "400",
          color: '#362FD9'

          }} 
          onClick={loginButton}
          >Already have an account? Login here</Button>
      </Box>

      </>)}

      <ToastContainer autoClose={2000} />


      </form>
</Grid>


</Grid> )}



{email && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter 6-digit code which was sent to {email}
              </Typography>

              <TextField
                type="email"
                id="email"
                onChange={(e) => {
                    setEmailCode(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="6-digit code"
                value={emailCode}
              ></TextField>

        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" onClick={checkPin}>
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}



    </>
  )
}

export default BrandSignup