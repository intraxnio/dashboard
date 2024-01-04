import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack, Grid } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import ClicksDateChart from './ClicksDateChart';
import ClicksCityChart from './ClicksCityChart';
import ClicksRegionChart from './ClicksRegionChart';
import ClicksCountryChart from './ClicksCountryChart';
import ClicksDevicetypeChart from './ClicksDevicetypeChart';
import ClicksBrowserChart from './ClicksBrowserChart';



function GetChartData({ shortId }) {

  const [loading, setLoading] = useState(false);
  const [clicksData, setClicksData] = useState('');
  const [uniqueVisitors, setuniqueVisitors] = useState([ ]);
  const [repeatVisitors, setRepeatVisitors] = useState([ ]);
  const user = useSelector((state) => state.brandUser);
  const baseUrl = "http://localhost:8001/usersOn";


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        axios.post(baseUrl + "/get-total-clicks-for-chart", {
          shortId : shortId
        }).then(ress=>{
    
            setuniqueVisitors(ress.data.data.uniqueVisitors);
            setRepeatVisitors(ress.data.data.repeatVisitors);
            console.log(ress.data.data.uniqueVisitors);
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


{loading ? (
          <CircularProgress size={25} color="warning" />
        ) : (

<>
<Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={12} md={11}
        >

            <ClicksDateChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors}/>
    
        </Grid>

     
      </Grid>

      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px"}}
        
      >
        <Grid item xs={12} sm={12} md={6}>

          <Typography sx={{ textAlign: 'center', marginBottom : '16px'}}>Top 5 cities</Typography>
            <ClicksCityChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors}/>
    
        </Grid>

        <Grid item xs={12} sm={12} md={6} >
            <Typography sx={{ textAlign: 'center', marginBottom : '16px'}}>Top 5 Regions</Typography>
            <ClicksRegionChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors}/>
    
        </Grid>

     
      </Grid>


      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={12} md={11} >
            <Typography sx={{ textAlign: 'center', marginBottom : '16px'}}>Top 5 Countries</Typography>
            <ClicksCountryChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors}/>
    
        </Grid>

     
      </Grid>

      <Grid
        container
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px"}}
        
      >
        <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ textAlign: 'center', marginBottom : '16px'}}>Top Browsers</Typography>
            <ClicksBrowserChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors}/>
        </Grid>

        <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ textAlign: 'center', marginBottom : '16px'}}>Device Types</Typography>
        <ClicksDevicetypeChart uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} />
        </Grid>
     
      </Grid>
</>



          )}
   
   </>
  )
}

export default GetChartData