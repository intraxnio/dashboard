import React, { useEffect} from "react";
import { Grid } from "@mui/material";
import TotalCampaignsBox from "./TotalCampaignsBox";
import TotalOngoingCampaignsBox from "./TotalOngoingCampaignsBox";
import TotalCompletedCampaigns from "./TotalCompletedCampaigns";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";





function BrandMainScreen() {

  const user = useSelector(state => state.brandUser);
  const navigate = useNavigate();



  useEffect(() => {

    if(!user.brand_id){

      navigate("/");

    }
    


  }, []);

  return (
    <>
 

      {user.brand_id ? (
        <>
         <Grid
         container
         spacing={1}
         direction="row"
         alignItems="center"
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
