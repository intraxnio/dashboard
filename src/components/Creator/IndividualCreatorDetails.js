import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Typography, Stack } from "@mui/material";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import ChartsCountry from "./ChartsCountry";
import  GenderChart  from "./GenderChart";
import  AgeChart  from "./AgeChart";
import ChartsCity from "./ChartsCity";
import RecentPosts from "./RecentPosts";
import { useLocation, useNavigate } from "react-router-dom";
import IndiBoxFollowers from "./IndiBoxFollowers";
import IndiBoxPosts from "./IndiBoxPosts";
import IndiBoxReach from "./IndiBoxReach";
import IndiBoxImpressions from "./IndiBoxImpressions";
import IndiChartsCountry from "./IndiChartsCountry";
import IndiGenderChart from "./IndiGenderChart";
import IndiChartsCity from "./IndiChartsCity";
import IndiAgeWiseChart from "./IndiAgeChart";
import IndiTableComponent from "./IndiRecentPosts";

function IndiCreatorInsights() {
    
  const navigate = useNavigate();
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const userId = searchParams.get("userId");

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
          <IndiBoxFollowers userId={userId} />
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
        <IndiBoxPosts userId={userId} />

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
        <IndiBoxReach userId={userId} />

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
        <IndiBoxImpressions userId={userId} />

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
            <IndiChartsCountry userId={userId} />
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
            <IndiGenderChart userId={userId} />
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
            <IndiChartsCity userId={userId} />
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
            <IndiAgeWiseChart userId={userId} />
          </Stack>
        </Grid>
      </Grid>
      <Stack>
        <IndiTableComponent userId={userId} />
      </Stack>
    </>
  );
}

export default IndiCreatorInsights;
