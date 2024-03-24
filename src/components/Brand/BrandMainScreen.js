import React, { useEffect, useState} from "react";
import { Grid, Button, Tooltip } from "@mui/material";
import TotalTransactions from "./TotalTransactions";
import TotalTransactionsAmount from "./TotalTransactionAmount";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';






function BrandMainScreen() {



  const user = useSelector(state => state.brandUser);
  const [ balance, setBalance] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const baseUrl = "http://localhost:8000/api";




  const fetchData = async () => {
    try {

      const fetchBalance = await axios.post("/api/brand/get-account-balance",
        {
          brand_id: user.brand_id,
        }
      );

      setBalance(fetchBalance.data.balance);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    if(!user.brand_id){

      navigate("/");

    }

    fetchData();


    


  }, []);

  return (
    <>

{loading ? (<CircularProgress />) : (<>

         <div
         style={{
           display: "flex",
           flexDirection: "column",
           flexGrow: 1,
           overflow: "hidden",
         }}
       >
         <div
           style={{
             display: "flex",
             justifyContent: "flex-start",
             marginBottom: "10px",
           }}
         >
          
           <Button
             variant="outlined"
             style={{
               
               textDecoration: "none",
               textTransform: "none",
             }}
             sx={{ paddingX: "20px"}}

           >
             Balance: &nbsp;{balance}
           </Button>
         </div>
 
 
         
       </div>
  
    </>)}
 

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
           xs={12}
           sm={12}
           md={4}
           spacing={0}
           direction="column"
           alignItems="center"
           justifyContent="center"
         >
           <TotalTransactions />
         </Grid>
 
         <Grid
           item
           xs={12}
           sm={12}
           md={4}
           spacing={0}
           direction="column"
           alignItems="center"
           justifyContent="center"
         >
         <TotalTransactionsAmount />
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
         {/* <TotalCompletedCampaigns /> */}
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
