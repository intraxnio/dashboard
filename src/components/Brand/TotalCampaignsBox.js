import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Grid, Box, Paper, Typography, Container, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import {useNavigate } from "react-router-dom";

function TotalCampaignsBox() {

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalCampaigns, setTotalCampaigns] = useState('');

  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }

  const makeFirstRequest = () => {
    // return axios.get("http://localhost:8000/api/v1/brand/getUser", {
      return axios.get("https://app.buzzreach.in/api/v1/brand/getUser", {
        withCredentials: true
      });
  };


  const makeSecondRequest = (id) => {
    // axios.post("http://localhost:8000/api/v1/brand/get-total-campaigns", {
      axios.post("https://app.buzzreach.in/api/v1/brand/get-total-campaigns", {
      userId: id,
    }).then(ress=>{

        setTotalCampaigns(formatNumber(ress.data.data));

    }).catch(e=>{

    })
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstResponse = await makeFirstRequest();
        console.log('First Response', firstResponse);
        if (firstResponse.data.data == null) {
          setIsLoggedIn(false);
        } else {
          setUserId(firstResponse.data.data);
          setIsLoggedIn(true);

          const secondResponse = await makeSecondRequest(
            firstResponse.data.data
          );

        }
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
        height: '180px',
        width: '300px',
        padding: '10px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Total Campaigns</Typography>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'20px',
            color:'orange'
            }}>{totalCampaigns}</Typography>

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

export default TotalCampaignsBox