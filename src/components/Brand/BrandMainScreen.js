import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Box, Paper, Typography, Container, Stack } from "@mui/material";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import ChartsCountry from "../Creator/ChartsCountry";
import  GenderChart  from "../Creator/GenderChart";
import  AgeChart  from "../Creator/AgeChart";
import ChartsCity from "../Creator/ChartsCity";
import RecentPosts from "../Creator/RecentPosts";
import { useNavigate } from "react-router-dom";
import BoxFollowers from "../Creator/BoxFollowers";
import BoxPosts from "../Creator/BoxPosts";
import BoxReach from "../Creator/BoxReach";
import BoxImpressions from "../Creator/BoxImpressions";
import TotalCampaignsBox from "./TotalCampaignsBox";
import TotalOngoingCampaignsBox from "./TotalOngoingCampaignsBox";
import TotalCompletedCampaigns from "./TotalCompletedCampaigns";
import { useSelector } from "react-redux";

function BrandMainScreen() {

  const user = useSelector(state => state.brandUser);


  return (
    <>
 

      {user.isLoggedIn ? (
        <>
         <Grid
         container
         spacing={1}
         direction="row"
         alignItems="center"
         sx={{ marginTop: "36px", borderTop: "1" }}
       >
         <Grid
           item
           xs={6}
           sm={6}
           md={4}
           container
           spacing={0}
           direction="column"
           alignItems="center"
           justifyContent="center"
         >
           <TotalCampaignsBox />
         </Grid>
 
         <Grid
           item
           xs={6}
           sm={6}
           md={4}
           container
           spacing={0}
           direction="column"
           alignItems="center"
           justifyContent="center"
         >
         <TotalOngoingCampaignsBox />
         </Grid>
 
         <Grid
           item
           xs={6}
           sm={6}
           md={4}
           container
           spacing={0}
           direction="column"
           alignItems="center"
           justifyContent="center"
         >
         <TotalCompletedCampaigns />
         </Grid>

         </Grid>


         <Grid
         container
         spacing={1}
         direction="row"
         alignItems="center"
         sx={{ marginTop: "46px", marginBottom: "46px", borderTop: "1" }}
       >
        <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
        >
        <iframe
          width="900"
          height="456"
          src='https://www.youtube.com/embed/FrpIhVTlMYc'
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          target="_blank"
        ></iframe>
        </div>
        </Grid>

        </>
       
      ) : (
        <p>Please log in to view your profile.</p>
      )}
     
{/* 
        <Grid
          item
          xs={6}
          sm={6}
          md={3}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <BoxImpressions />
        </Grid> */}
    


      {/* second level components  */}
      {/* <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={6} md={5}>
          <Stack
            sx={{
              color: "primary.main",
              height: "500px",
            }}
          >
            <Typography sx={{ marginBottom: "40px" }}>
              Top Followers by Country
            </Typography>
            <ChartsCountry />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Stack
            sx={{
              backgroundColor: "#eeeee",
              color: "white",
              height: "500px",
            }}
          >
            <Typography sx={{ color: "primary.main" }}>
              Followers by Gender
            </Typography>
            <GenderChart />
          </Stack>
        </Grid>
      </Grid> */}

      {/* third-level components  */}

      {/* <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={6} md={5}>
          <Stack
            sx={{
              color: "primary.main",
              height: "500px",
            }}
          >
            <Typography sx={{ marginBottom: "40px" }}>
              Top Followers by Cities
            </Typography>
            <ChartsCity />
          </Stack>
        </Grid>
        <Grid item xs={6} sm={5} md={5}>
          <Stack
            sx={{
              backgroundColor: "#eeeee",
              color: "white",
              height: "500px",
            }}
          >
            <Typography sx={{ color: "primary.main" }}>
              Followers by Age
            </Typography>
            <AgeChart />
          </Stack>
        </Grid>
      </Grid> */}
    

    </>
  );
}

export default BrandMainScreen;
