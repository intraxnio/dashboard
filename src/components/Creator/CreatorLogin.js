import React, { useState, useEffect } from "react";
import sideImage from "../../images/banner2.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { useSelector, useDispatch} from 'react-redux';
import {login} from '../../store/creatorSlice';
import CircularProgress from '@mui/material/CircularProgress';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';







function CreatorLogin() {

  const user = useSelector(state => state.creatorUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  var fbAppID = '957873452119557';
  var fb_redirecturl = 'https://app.broadreach.in/insta_graph_dialogue';
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";





  useEffect(() => {

    if(user.creator_id){

      navigate("/creator/getAllCampaigns");

    }
    
  }, []);

  


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
      toast.warning("All fields are mandatory");
    }
    else {

      setIsLoading(true);

    await axios.post( baseUrl+"/creator/creator-login",

        { email: email, password: password },
        {withCredentials: true}
      )
      .then((res) => {



        const isLoggedIn = true;
        const creator_id = res.data.creatorObj.creator_id;
        const creator_name = res.data.creatorObj.creator_name;
        const creator_category = res.data.creatorObj.creator_category;
     
        const userDetails = { email, creator_id, creator_name, creator_category, isLoggedIn };
        
        dispatch(login(userDetails));

        if(res.data.creatorObj.is_instagram_connected){

          setIsLoading(false);
          navigate("/creator/getAllCampaigns");

        }

        else if(!res.data.creatorObj.is_instagram_connected){
          var url = 'https://www.facebook.com/v17.0/dialog/oauth?client_id='+ fbAppID +'&redirect_uri='+fb_redirecturl+'&config_id=746579797244533';
            window.open(url, '_self').focus();
        }
      
      })
      .catch((err) => {
        if (err.response && err.response.data.error === "Invalid email or password") {
        setIsLoading(false);
          toast.warning("Invalid email or password");
        } 

        else if (err.response && err.response.data.error === "Internal server error") {
        setIsLoading(false);
          toast.warning("Internal server error");
        } 

        else if (err.response && err.response.data.error === "email, password mismatch") {
        setIsLoading(false);
          toast.warning("Invalid email or password");
        } 
        
        else {
        setIsLoading(false);
          toast.error("An error occurred. Please try again later.");
        }
      });
    }
  };


  const signUp = () =>{

    navigate("/signup/creator");

  }

  return (
    <>
      <Grid container spacing="2" paddingX={2}>
        <Grid item xs={12} md={12}>
          <form action="#" method="post">

          {isLoading ? (
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginTop: '30%' }}>
           <CircularProgress color= 'success' />
         </div>
         ) : ( <>
            <Box
              display="flex"
              flexDirection={"column"}
              maxWidth={450}
              margin="auto"
              marginTop={15}
              padding={1}
            >
              <Typography variant="h5" padding={3} textAlign="center">
                Influencer Login
              </Typography>

              <TextField
                type="email"
                id="email"
                onChange={(e) => {
                  getEmail(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Work Email"
              ></TextField>
              <TextField
                type="password"
                id="password"
                onChange={(e) => {
                  getPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Create a Password"
              ></TextField>
              <Button
                type="submit"
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  marginTop: 3,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                  background: '#362FD9'

                }}
                size="large"
              >
                Login
              </Button>


              <Typography variant="body2" sx={{marginTop : '5px'}}>
                I agree to{" "}
                <Link href="#" underline="none" sx={{color: '#362FD9'}}>
                  BroadReach's Terms of Service
                </Link>
              </Typography>

              <Button
                variant="outlined"
                size="large"
                onClick={signUp}
                sx={{
                  marginTop: 3,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                  color: '#362FD9'

                }}
              >
                Create new Account Here
              </Button>
            </Box>
            </> ) }
          </form>
        </Grid>
        <ToastContainer autoClose= {2000}/>

        {/* <Grid item xs={12} md={4}>
          <img
            className="img-fluid"
            src={sideImage}
            alt="Passion into Profession"
          /> */}
        {/* </Grid> */}
      </Grid>
    </>
  );
}

export default CreatorLogin;
