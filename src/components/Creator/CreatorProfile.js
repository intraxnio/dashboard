import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Link, Grid, Stack, Card } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";







function CreatorProfile() {

  const user = useSelector(state => state.creatorUser);
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(true);
  const [ creatorCampDetails, setCreatorCampDetails ] = useState('');
  const baseUrl = "http://localhost:8000/api";


  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "K";
    } else {
      return number.toString();
    }
  }


  useEffect(() => {

    if(!user.creator_id){

      navigate("/login/creator");
  
    }
    else if(user.creator_id){

    
    const fetchData = async () => {
      try {

            axios.post(baseUrl + "/creator/creator-camp-details", {
            userId: user.creator_id
          }).then(ress=>{
      
           
          
            setCreatorCampDetails(ress.data.data);
            setLoading(false);
      
          }).catch(e=>{
      
          })
      
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }
  }, []);






  return (
    <>
 

      {user.creator_id ? (
        <> 

        { loading ?  (<CircularProgress />) : (
          <>


          <Grid item xs={12} sm={6} md={6} marginTop={3}>
 
           <Stack display='flex' flexDirection = {'row'} justifyContent={'space-evenly'}>
             
             <Box
               display="flex"
               flexDirection={"column"}
             >
               <Typography sx={{textAlign : 'center', paddingX : '12px', paddingY : '6px'}}> Total Campaigns</Typography>
 
               <div display={'flex'} sx={{ justifyContent: 'center', alignItems : 'center'}} >
               <Typography paddingY ={1} sx={{ textAlign : 'center', fontSize : '22px'}}> { creatorCampDetails.total_campaigns}</Typography>
 
               </div>
 
               </Box>
 
               <Box
               display="flex"
               flexDirection={"column"}
             >
               <Typography sx={{textAlign : 'center', paddingX : '12px', paddingY : '6px'}}> Total Revenue</Typography>
 
               <div display={'flex'} sx={{ justifyContent: 'center', alignItems : 'center'}} >
               <Typography paddingY ={1} sx={{ textAlign : 'center', fontSize : '22px'}}>Rs. {formatNumber(creatorCampDetails.revenue)}</Typography>
 
               </div>
 
               </Box>
 
 
               <Box
               display="flex"
               flexDirection={"column"}
             >
               <Typography sx={{textAlign : 'center', paddingX : '12px', paddingY : '6px'}}> Ongoing Campaigns</Typography>
 
               <div display={'flex'} sx={{ justifyContent: 'center', alignItems : 'center'}} >
               <Typography paddingY ={1} sx={{ textAlign : 'center', fontSize : '22px'}}> { creatorCampDetails.onGoing_posts}</Typography>
 
               </div>
 
               </Box>
 
 
 
 
 
               </Stack>
               </Grid>

 
        <Grid item xs={12} sm={6} md={6}>
             <Box
               display="flex"
               flexDirection={"column"}
               maxWidth={450}
               // margin="auto"
               marginTop={5}
               padding={1}
             >
              
               <Button
                 type="submit"
                 onClick={ ()=> { navigate("/creator/accountSettings")}}
                 variant="contained"
                 sx={{
                   marginTop: 3,
                   textTransform: "capitalize",
                   fontWeight: "300",
                   fontSize: 16,
                   background : '#3E54AC'
                 }}
                 size="large"
               >
                 Account Settings
               </Button>
 
               <Button
                 type="submit"
                 onClick={ ()=> { navigate("/creator/connect/instagram")}}
                 variant="contained"
                 sx={{
                   marginTop: 3,
                   textTransform: "capitalize",
                   fontWeight: "300",
                   fontSize: 16,
                   background : '#3E54AC'
 
                 }}
                 size="large"
               >
                 Link Instagram
               </Button>
 
               <Button
                 type="submit"
                 onClick={ ()=> { navigate("/creator/bankDetails")}}
                 variant="contained"
                 sx={{
                   marginTop: 3,
                   textTransform: "capitalize",
                   fontWeight: "300",
                   fontSize: 16,
                   background : '#3E54AC'
 
                 }}
                 size="large"
               >
                 Bank Details
               </Button>
 
               <Button
                 type="submit"
                 onClick={ ()=> { navigate("/creator/payouts")}}
                 variant="contained"
                 sx={{
                   marginTop: 3,
                   textTransform: "capitalize",
                   fontWeight: "300",
                   fontSize: 16,
                   background : '#3E54AC'
 
                 }}
                 size="large"
               >
                 Payouts
               </Button>
 
 
 
               <Button
                 type="submit"
                 onClick={ ()=> { navigate('/creator/privacyPolicy')}}
                 variant="contained"
                 sx={{
                   marginTop: 3,
                   textTransform: "capitalize",
                   fontWeight: "300",
                   fontSize: 16,
                   background : '#3E54AC'
 
                 }}
                 size="large"
               >
                 Privacy Policy
               </Button>
 
               <Button
                 type="submit"
                 onClick={ ()=> {navigate('/creator/termsAndConditions')}}
                 variant="contained"
                 sx={{
                   marginTop: 3,
                   textTransform: "capitalize",
                   fontWeight: "300",
                   fontSize: 16,
                   background : '#3E54AC'
 
                 }}
                 size="large"
               >
                 Terms & Conditions
               </Button>
 
 
             </Box>
         </Grid>
 
 
 
         </>
        ) }

        </>
       
              
       
      ) : (
        <p>Please log in to view your profile.</p>
      )}
     

    </>
  );
}

export default CreatorProfile;
