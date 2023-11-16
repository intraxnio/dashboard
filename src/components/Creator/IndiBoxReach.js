import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Grid, Box, Paper, Typography, Container, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import {useNavigate } from "react-router-dom";

function IndiBoxReach({userId}) {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reach, setReach] = useState('');

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
    axios.post("http://localhost:8000/api/v1/creator/creator-reach-28days", {
      userId: id,
    }).then(ress=>{

        setReach(formatNumber(ress.data.reach));
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
        backgroundColor: 'primary.main',
        color: 'white',
        height: '230px',
        width: '230px',
        padding: '16px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Reach</Typography>
        <Typography sx={{
            fontSize:'60px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>{reach}</Typography>

          <Stack direction='row' spacing={1}>
            <NorthOutlinedIcon/>
            <Typography  sx={{}}>
            Last 28 days reach
            </Typography>
          </Stack>

    </Box>
   </>
  )
}

export default IndiBoxReach