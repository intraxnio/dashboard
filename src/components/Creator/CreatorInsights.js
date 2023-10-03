import React, { useState, useEffect} from 'react'
import { Grid, Typography, Stack } from "@mui/material";
import ChartsCountry from "./ChartsCountry";
import  GenderChart  from "./GenderChart";
import  AgeChart  from "./AgeChart";
import ChartsCity from "./ChartsCity";
import RecentPosts from "./RecentPosts";
import BoxFollowers from "./BoxFollowers";
import BoxPosts from "./BoxPosts";
import BoxReach from "./BoxReach";
import BoxImpressions from "./BoxImpressions";
import { useSelector } from "react-redux";
import axios from 'axios';




function CreatorInsights() {

  const user = useSelector(state => state.creatorUser);

  
  useEffect(() => {
    axios.post("http://localhost:8000/api/v1/creator/creator-insights", {
      userId: user.creator_id,
    }).then(ress=>{


    }).catch(e=>{

    })

  }, []);
    
  return (
    <>
      {/* first-level components  */}
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        sx={{ marginTop: "64px", borderTop: "1" }}
      >
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
          <BoxFollowers />
        </Grid>

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
        <BoxPosts />
        </Grid>

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
        <BoxReach />
        </Grid>

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
        </Grid>
      </Grid>

      {/* second level components  */}
      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={6} md={8}>
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

        <Grid item xs={12} sm={6} md={4}>
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
      </Grid>

      {/* third-level components  */}

      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={6} md={8}>
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
        <Grid item xs={6} sm={5} md={4}>
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
      </Grid>
      <Stack>
        <RecentPosts />
      </Stack>
    </>
  );
}

export default CreatorInsights;
