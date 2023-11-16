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
  Select,
  ClickAwayListener, Dialog, DialogTitle, DialogContent, DialogActions,
  
} from '@mui/material';
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';




function CreatorSignup() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [category, setCategory] = useState('Actor');
  const [isLoading, setIsLoading] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const baseUrl = "http://localhost:8000/api";




  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };


  async function submit(e) {

    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;
    const mobileRegex = /^\d{1,10}$/;



    if(!email || !password || !category ){
      toast.warning("All fields are mandatory");
    }

    else if(!emailRegex.test(email)){
      toast.warning("Invalid email address");
    }

    else if (!mobileRegex.test(mobileNum)) {
      toast.warning("Invalid mobile number");
    }

    else {

      setIsLoading(true);

    try {

      await axios.post("http://localhost:8000/api/creator/signup-creator", 
      { email: email, password: password, category: category }).then((res) => {

        if(res.data.success){

          setIsLoading(false);
          

          setIsDialogOpen(true);
        }
      })
      .catch((err) => {
        // toast.error(err.response.data.message);
      });



    }
    catch (e) {
      console.log(e)

    }

  }
  }

  const checkPin = async (e) => {
    e.preventDefault();

    if(!emailCode){
        toast.warning("Enter valid 6-digit Pin");
      }

      else {


      await axios.post(baseUrl+"/creator/check-resetPin-withDb-InfluencerTemp",
        { email: email.toLowerCase(), pin : emailCode },
        {withCredentials: true}
      )
      .then((res) => {

            setIsLoading(true);

            if(!res.data.matching){
              setIsLoading(false);
                toast.error("Invalid Pin");

            }
            else if(res.data.matching){
                
              setIsLoading(false);
                setIsDialogOpen(false);
                toast.success("Account created successfully. Please login to continue...");

                setTimeout(() => {
                  navigate("/login/creator");
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

  const creatorLoginGo = () =>{

    navigate("/login/creator");

  }

  return (
    <>
<Grid container spacing='2' paddingX={2}>
  <Grid item xs={12}>
  
  <form action='#' method='post'>

  {isLoading ? (
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginTop: '30%' }}>
           <CircularProgress color= 'success' />
         </div>
         ) : ( <>

      <Box 
      display='flex' 
      flexDirection={'column'} 
      maxWidth={450} 
      margin='auto'
      marginTop={15}
      padding={1}
      >
        <Typography variant='h5' padding={3} textAlign='center'>Influencer Signup</Typography>

        <TextField type='email' id='email' sx={{ marginBottom : '16px'}} onChange={(e)=>{setEmail(e.target.value)}} variant='outlined' label='Work Email'></TextField>
        <TextField type='password' id="password" sx={{ marginBottom : '16px'}} onChange={(e)=>{setPassword(e.target.value)}} variant='outlined' label='Create a Password'></TextField>
        <TextField
          type='tel'
          id="mobileNumber"
          sx={{ marginBottom: '16px' }}
          onChange={(e) => {
            // Ensure the input is numeric and limit to 10 digits
            setMobileNum(e.target.value);
          }}
          variant='outlined'
          label='Enter 10 digit mobile number'
          inputProps={{ maxLength: 10 }}
        />
        <Select
        labelId="category-label"
        id="category-select"
        value={category}
        onChange={(e)=>{setCategory(e.target.value)}} >
        <MenuItem disabled value="">Select Category</MenuItem>
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
                      fontSize: 16,
                  background: '#362FD9'

                      }} 
                size='large'>Create Account</Button>

        <Typography variant="body2" sx={{marginTop : '5px'}}>
                I agree to{" "}
                <Link href="#" underline="none" sx={{color: '#362FD9'}}>
                  BroadReach's Terms of Service
                </Link>
              </Typography>
        <Button variant='outlined' size='large' onClick={creatorLoginGo}
        sx={{
          marginTop:3,
          textTransform:'capitalize',
          fontWeight: '300',
          fontSize: 16,
          color: '#362FD9'

          }} 
          >Already have account? Login here</Button>
      </Box>

      </> )}

      </form>
</Grid>

<ToastContainer autoClose= {2000}/>

</Grid>


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

export default CreatorSignup