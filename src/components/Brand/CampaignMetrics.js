import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Box, Typography, TableContainer, Stack, Button } from "@mui/material";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CampaignMetricsIndividualPosts from "./CampaignMetricsIndividualPosts";


function CampaignMetrics() {

  const user = useSelector(state => state.brandUser);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");
  const [totalCreators, setTotalCreator] = useState('');
  const [totalReach, setTotalReach] = useState('');
  const [totalImpressions, setTotalImpressions] = useState('');
  const [totalBudget, setTotalBudget] = useState('');

  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }

  useEffect(() => {
    // axios.post("http://localhost:8000/api/v1/brand/completed-campaign-metrics", {
      axios.post("https://app.buzzreach.in/api/v1/brand/completed-campaign-metrics", {
        campaignId: campaignId,
      }).then(ress=>{
        
          setTotalCreator(ress.data.data.verifiedPosts);
          setTotalReach(ress.data.data.reach);
          setTotalImpressions(ress.data.data.impressions);
          setTotalBudget(ress.data.data.budget);
  
      }).catch(e=>{
  
      })
  }, []);

  const handleBackClick = () => {
    navigate(`/brand/campaigns/${campaignId}/details`);

  };


  return (
    <>
 
 {/* <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick} sx={{marginBottom: '30px'}}>Back</Button> */}

      {/* {user.isLoggedIn ? ( */}
      
         <Grid container spacing={0} direction="row" alignItems="center" sx={{ marginTop: "64px", borderTop: "1" }}>
        
         <Grid item xs={6} sm={6} md={3} container spacing={0} direction="column" alignItems="center" justifyContent="center" >

           <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        height: '180px',
        width: '220px',
        padding: '10px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Total Influencers</Typography>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>{totalCreators}</Typography>

          <Stack direction='row' spacing={1}   sx={{
            paddingLeft : '5px',
          }}>
            <NorthOutlinedIcon/>
            <Typography  sx={{
                fontSize : '16px'
            }}>
               Participated
            </Typography>
          </Stack>

    </Box>

         </Grid>

         <Grid item xs={6} sm={6} md={3} container spacing={0} direction="column" alignItems="center" justifyContent="center" >

           <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        height: '180px',
        width: '220px',
        padding: '10px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Total Reach</Typography>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>{formatNumber(totalReach)}</Typography>

          <Stack direction='row' spacing={1}   sx={{
            paddingLeft : '5px',
          }}>
            <NorthOutlinedIcon/>
            <Typography  sx={{
                fontSize : '16px'
            }}>
               Campaign
            </Typography>
          </Stack>

    </Box>

         </Grid>

         <Grid item xs={6} sm={6} md={3} container spacing={0} direction="column" alignItems="center" justifyContent="center" >

           <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        height: '180px',
        width: '220px',
        padding: '10px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Total Impressions</Typography>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>{formatNumber(totalImpressions)}</Typography>

          <Stack direction='row' spacing={1}   sx={{
            paddingLeft : '5px',
          }}>
            <NorthOutlinedIcon/>
            <Typography  sx={{
                fontSize : '16px'
            }}>
               Campaign
            </Typography>
          </Stack>

    </Box>

         </Grid>

         <Grid item xs={6} sm={6} md={3} container spacing={0} direction="column" alignItems="center" justifyContent="center" >

           <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        height: '180px',
        width: '220px',
        padding: '10px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Budget Spent</Typography>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>{formatNumber(totalBudget)}</Typography>

          <Stack direction='row' spacing={1}   sx={{ paddingLeft : '5px' }}>
            <Typography  sx={{ fontSize : '14px'}}> Cost Per Reach: Rs 
               
              <span  style={{ fontSize : '14px', color: 'orange'}}> {formatNumber((totalBudget/totalReach).toFixed(3))}/-</span>
            </Typography>
          </Stack>
    </Box>
         </Grid>
         


         </Grid>
         

         <TableContainer sx={{marginTop:'40px', padding:'10px'}}>

         <CampaignMetricsIndividualPosts campaignId={campaignId} />

         </TableContainer>
         




       
    {/* //   ) : ( */}
    {/* //     <p>Please log in to view your profile.</p> */}
    {/* //   )} */}
    

    </>
  );
}

export default CampaignMetrics;
