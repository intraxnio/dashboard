import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';


import {useNavigate } from "react-router-dom";

function IndiBoxFollowers({userId}) {

  const navigate = useNavigate();
  const [followers, setFollowers] = useState('');
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


  const makeSecondRequest = (id) => {
    axios.post(baseUrl + "/brand/creator-followers", {
      userId: id,
    }).then(ress=>{

        setFollowers(formatNumber(ress.data.followers));

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
        <Typography sx={{ fontSize: '16px'}}>Followers</Typography>
        <Typography sx={{
            fontSize:'48px',
            textAlign:'center',
            padding:'8px',
            color:'orange'
            }}>{followers}</Typography>

    </Box>
   </>
  )
}

export default IndiBoxFollowers