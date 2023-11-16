import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Grid, Box, Paper, Typography, Container, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import {useNavigate } from "react-router-dom";

function IndiBoxImpressions({userId}) {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [impressions, setImpressions] = useState('');
  const baseUrl = "http://13.234.41.129:8000/api";


  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }


  const makeSecondRequest = (id) => {
    axios.post(baseUrl + "/brand/creator-impressions-28days", {
      userId: id,
    }).then(ress=>{

        setImpressions(formatNumber(ress.data.impressions));
        // setPosts(ress.data.data.media_count);
        console.log('response:::::::', ress);

    }).catch(e=>{

    })
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

          const secondResponse = await makeSecondRequest(
            userId
          );

        
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
        height: '160px',
        width: '260px',
        padding: '14px',
        borderRadius:'10px',
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Impressions</Typography>
        <Typography sx={{
            fontSize:'48px',
            textAlign:'center',
            padding:'8px',
            color:'orange'
            }}>{impressions}</Typography>
            <Typography  sx={{ fontSize: '14px'}}>
            Last 28 days
            </Typography>

          {/* <Stack direction='row'> */}
            {/* <NorthOutlinedIcon/> */}
            {/* <Typography  sx={{ marginBottom: '10px'}}>
            Last 28 days
            </Typography> */}
          {/* </Stack> */}

    </Box>
   </>
  )
}

export default IndiBoxImpressions