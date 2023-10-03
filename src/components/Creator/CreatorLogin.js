import React, { useState, useEffect } from "react";
import sideImage from "../../images/banner2.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { useSelector, useDispatch} from 'react-redux';
import {login} from '../../store/creatorSlice';




function CreatorLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        "http://localhost:8000/api/v1/creator/creator-login",

        { email: email, password: password },
        {withCredentials: true}
      )
      .then((res) => {
        // const creator_id = res.data.creatorObj.creator_id;
        // const creator_name = res.data.creatorObj.creator_name;
        // const creator_category = res.data.creatorObj.creator_category;
     
        // const userDetails = { email, creator_id, creator_name, creator_category };
        
        // dispatch(login(userDetails));
        toast.success("Login Success!");
        
        navigate("/connect/instagram");
      })
      .catch((err) => {
        // toast.error(err.response.data.message);
      });
  };

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
                }}
                size="large"
              >
                Login
              </Button>


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

export default CreatorLogin;
