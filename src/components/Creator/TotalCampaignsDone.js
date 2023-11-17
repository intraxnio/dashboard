import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';



function TotalCampaignsDone() {

  const [loading, setLoading] = useState(false);
  const [totalCampaigns, setTotalCampaigns] = useState('');
  const user = useSelector(state => state.creatorUser);


  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";




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
    const fetchData = async () => {
      setLoading(true);
      try {

        axios.post(baseUrl+"/creator/get-total-campaigns-done", {
          userId: user.creator_id,
        }).then(ress=>{
    
            setTotalCampaigns(formatNumber(ress.data.data));
            setLoading(false);

    
        }).catch(e=>{
    
        })
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
   <>
     <Box sx={{
        backgroundColor: '#3E54AC',
        color: 'white',
        height: '180px',
        width: '300px',
        padding: '10px',
        borderRadius:'10px',
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Total Campaigns</Typography>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress size={25} color="warning" />
        ) : (
          <Typography sx={{
            fontSize: '50px',
            textAlign: 'center',
            padding: '20px',
            color: 'orange'
          }}>{totalCampaigns}</Typography>
        )}
      </div>

          <Stack direction='row' spacing={1}   sx={{
            paddingLeft : '5px',
          }}>
            <NorthOutlinedIcon/>
            <Typography  sx={{
                fontSize : '16px'
            }}>
               Up to date
            </Typography>
          </Stack>
    </Box>
   </>
  )
}

export default TotalCampaignsDone