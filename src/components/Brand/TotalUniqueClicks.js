import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';



function TotalUniqueClicks({ shortId, onDataAvailable }) {

  const [loading, setLoading] = useState(false);
  const [clicksData, setClicksData] = useState('');
  const user = useSelector((state) => state.brandUser);
  // const baseUrl = "http://localhost:8001/usersOn";






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

        axios.post("/api/usersOn/get-total-unique-clicks", {
          shortId : shortId
        }).then(ress=>{
    
            setClicksData(ress.data.data.length);
            onDataAvailable(
              { data: ress.data.data.length}
             );
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

     <Box id="unique-clicks-section"
     sx={{
        backgroundColor: '#0E21A0',
        color: 'white',
        height: '100%',
        width: '90%',
        padding: '10px',
        borderRadius:'10px',
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Unique Clicks</Typography>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress size={25} color="warning" />
        ) : (
          <Typography sx={{
            fontSize: '50px',
            textAlign: 'center',
            padding: '20px',
            color: 'orange'
          }}>{clicksData}</Typography>
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

export default TotalUniqueClicks