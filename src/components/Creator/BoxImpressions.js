import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';
import { useSelector } from "react-redux";
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';



function BoxImpressions() {
  
  const user = useSelector(state => state.creatorUser);
  const [impressions, setImpressions] = useState('');

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
    axios.post("http://localhost:8000/api/v1/creator/creator-impressions-28days", {
      userId: user.creator_id,
    }).then(ress=>{

      setImpressions(formatNumber(ress.data.impressions));


    }).catch(e=>{

    })
  }, []);

  return (
   <>
     <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              height: '160px',
              width: '230px',
              padding: '16px',
              borderRadius:'10px',

              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
           
              <Stack spacing={2} direction='row'>
        <VisibilityTwoToneIcon />
        <Typography sx={{ fontSize: '16px'}}>Impressions</Typography>
        </Stack>
        <Typography sx={{
            fontSize:'50px',
            textAlign:'center',
            padding:'12px',
            color:'orange'
            }}>{impressions}</Typography>

            <Typography  sx={{fontSize: '12px'}}>
               Last 28 days
            </Typography>
          </Box>
   </>
  )
}

export default BoxImpressions