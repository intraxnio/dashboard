import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import { useSelector } from "react-redux";
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';


function BoxFollowers() {

  const user = useSelector(state => state.creatorUser);
  const [followers, setFollowers] = useState('');

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
    axios.post("http://localhost:8000/api/v1/creator/creator-followers", {
      userId: user.creator_id,
    }).then(ress=>{

        setFollowers(formatNumber(ress.data.followers));

    }).catch(e=>{

    })

  }, []);

  return (
   <>
     <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        height: '160px',
        width: '230px',
        padding: '16px',
        borderRadius:'10px',
        
        '&:hover': {
            backgroundColor: 'primary.light'
        }
    }}
    > 
        <Stack spacing={2} direction='row'>
        <PeopleAltTwoToneIcon />
        <Typography sx={{ fontSize: '16px'}}>Followers</Typography>
        </Stack>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'12px',
            color:'orange'
            }}>{followers}</Typography>

            <Typography  sx={{fontSize: '12px'}}>
               Up to date
            </Typography>

    </Box>
   </>
  )
}

export default BoxFollowers