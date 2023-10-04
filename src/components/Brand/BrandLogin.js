import React, { useState, useEffect } from "react";
import sideImage from "../../images/banner2.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch} from 'react-redux';
import {login} from '../../store/brandSlice';

// const { createToken, isBrandAuthenticated } = require("../../backend/middleware/jwtToken");



function BrandLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
      toast.warning("All fields are mandatory");
    }

    else{

      await axios
      // .post("http://localhost:8000/api/v1/brand/brand-login",
      .post("http://app.buzzreach.in/api/v1/brand/brand-login",

        { email: email.toLowerCase(), password: password },
        {withCredentials: true}
      )
      .then((res) => {
          const brand_id = res.data.brandObj.brand_id;
          const brand_name = res.data.brandObj.brand_name;
          const brand_category = res.data.brandObj.brand_category;
          const userDetails = { email, brand_id, brand_name, brand_category };
          dispatch(login(userDetails));
          toast.success("Login Success!");
          navigate("/brand/dashboard");

      })
      .catch((err) => {
        if (err.response && err.response.data.error === "All fields are mandatory") {
          toast.warning("All fields are mandatory");
        } 

        else if (err.response && err.response.data.error === "User does not exists!") {
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

  const signupButton = async () => {

    navigate("/signup/brand");
    

  }

  return (
    <>
      <Grid container spacing="2">
        <Grid item xs={8}>
          <form action="#" method="post">
            <Box
              display="flex"
              flexDirection={"column"}
              maxWidth={450}
              margin="auto"
              marginTop={15}
              padding={1}
            >
              <Typography variant="h5" padding={3} textAlign="center">
                Brand Login
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
                label="Enter Password"
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
                }}
                size="large"
              >
                Login
              </Button>
              <ToastContainer autoClose= {2000}/>


              <Typography variant="body2">
                I agree to{" "}
                <Link href="#" underline="none">
                  Buzzreach's Terms of Service
                </Link>
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  marginTop: 3,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                }}
                onClick={signupButton}
              >
                Create new Account Here
              </Button>
            </Box>
          </form>
        </Grid>
        <Grid item xs={4}>
          <img
            className="img-fluid"
            src={sideImage}
            alt="Passion into Profession"
          />
        </Grid>
      </Grid>
    </>
  );
}

export default BrandLogin;
