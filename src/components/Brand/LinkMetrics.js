import React, { useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, Box, Typography } from '@mui/material';
import { useSelector } from "react-redux";
import TotalClicks from "./TotalClicks";
import TotalUniqueClicks from "./TotalUniqueClicks";
import LinkSettingsGrid from './LinkSettingsGrid';
import CircularProgress from '@mui/material/CircularProgress';
import ClicksDateChart from './ClicksDateChart';
import ClicksCityChart from './ClicksCityChart';
import ClicksRegionChart from './ClicksRegionChart';
import ClicksCountryChart from './ClicksCountryChart';
import ClicksDevicetypeChart from './ClicksDevicetypeChart';
import ClicksBrowserChart from './ClicksBrowserChart';
import DuplicateClicksDateChart from './DuplicateClicksDateChart';
import GetChartData from './GetChartData';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import DatePicker from '@mui/lab/DatePicker';







export default function LinkMetrics() {
  const user = useSelector(state => state.brandUser);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const linkId = searchParams.get("linkId");
  const [totalClicks, setTotalClicks] = useState('');
  const [totalUniqueClicks, setTotalUniqueClicks] = useState('');
  const [dateChart, setDateChart] = useState('');
  const [uniqueVisitors, setuniqueVisitors] = useState([ ]);
  const [repeatVisitors, setRepeatVisitors] = useState([ ]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('last30Days');
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const baseUrl = "http://localhost:8001/usersOn";


 

  
  useEffect(() => {

    if(!user.user_id){

      navigate("/");

    }

    else{

      switch (timeRange) {
        case 'last7Days':
          setStartDate(new Date());
          setStartDate((prevStartDate) => {
            prevStartDate.setDate(prevStartDate.getDate() - 7);
            return prevStartDate;
          });
          break;
        case 'last30Days':
          setStartDate(new Date());
          setStartDate((prevStartDate) => {
            prevStartDate.setDate(prevStartDate.getDate() - 30);
            return prevStartDate;
          });
          break;
        case 'custom':
          if (selectedDates[0] && selectedDates[1]) {
            setStartDate(selectedDates[0]);
            setEndDate(new Date(selectedDates[1]));
          }
          break;
        default:
          setStartDate(new Date());
      }

      

      const fetchData = async () => {
        setLoading(true);
        try {
  
          axios.post("/api/usersOn/get-total-clicks-for-chart", {
            shortId : linkId
          }).then(ress=>{
      
              setuniqueVisitors(ress.data.data.uniqueVisitors);
              setRepeatVisitors(ress.data.data.repeatVisitors);
              setLoading(false);

            
            
           
  
      
          }).catch(e=>{
      
          })
          
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }
    


  }, [timeRange, selectedDates]);


  const handleBackClick = () => {
    navigate(`/brand/linksCard`);

  };


  const handleTotalClicks = (data) => {
    setTotalClicks(data);
    console.log('Dataaa::::', data);
  };

  const handleTotalUniqueClicks = (data) => {
    setTotalUniqueClicks(data);
    console.log('Dataaa::::', data);
  };

  const handleFilterChange = (event) => {
    setTimeRange(event.target.value);
  };


  
 
// chart PDF
// const handleDownloadPDF = async () => {
//   try {
//     setLoading(true);

//     const chartContainer = document.getElementById('chart-container'); // Replace 'chart-container' with the actual ID of the container wrapping your chart
//     if (!chartContainer) {
//       console.error("Chart container not found");
//       setLoading(false);
//       return;
//     }

//     // Capture the chart container as an image using html2canvas
//     const canvas = await html2canvas(chartContainer);

//     // Convert the canvas image to data URL
//     const imageData = canvas.toDataURL('image/png');

//     // Create a PDF document
//     const pdf = new jsPDF();
    
//     // Add the image to the PDF
//     pdf.addImage(imageData, 'PNG', 10, 10, 190, 100); // Adjust the coordinates and dimensions as needed

//     // Download the PDF
//     pdf.save('link_metrics_report.pdf');

//     setLoading(false);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     setLoading(false);
//   }
// };


const handleDownloadPDF = async () => {
  try {
    setLoading(true);

    // Create a new PDF document

    const pageHeight = 550; // Adjust the height as needed

    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, pageHeight], // Width and height of the page in millimeters (A4 size)
    });

    // Define the dimensions and resolution for the Total Clicks section
    const totalClicksSection = document.getElementById('total-clicks-section');
    const totalClicksCanvas = await html2canvas(totalClicksSection, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(totalClicksCanvas.toDataURL('image/png'), 'PNG', 10, 10);

    // Define the dimensions and resolution for the Unique Clicks section
    const uniqueClicksSection = document.getElementById('unique-clicks-section');
    const uniqueClicksCanvas = await html2canvas(uniqueClicksSection, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(uniqueClicksCanvas.toDataURL('image/png'), 'PNG', 120, 10);


    const dateChartSection = document.getElementById('chart-container');
    const dateChartCanvas = await html2canvas(dateChartSection, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(dateChartCanvas.toDataURL('image/png'), 'PNG', 10, 110, 190, 90);
    

    const top5Cities = document.getElementById('city-chart-container');
    const top5CitiesCanvas = await html2canvas(top5Cities, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(top5CitiesCanvas.toDataURL('image/png'), 'PNG', 10, 220, 100, 65);


    const top5Regions = document.getElementById('region-chart-container');
    const top5RegionsCanvas = await html2canvas(top5Regions, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(top5RegionsCanvas.toDataURL('image/png'), 'PNG', 120, 220, 100, 65);


    const countryChartSection = document.getElementById('country-chart-container');
    const countryChartCanvas = await html2canvas(countryChartSection, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(countryChartCanvas.toDataURL('image/png'), 'PNG', 10, 300, 190, 90);

    const browserChartSection = document.getElementById('browser-chart-container');
    const browserChartCanvas = await html2canvas(browserChartSection, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(browserChartCanvas.toDataURL('image/png'), 'PNG', 10, 430, 80, 90);


    const deviceChartSection = document.getElementById('device-chart-container');
    const deviceChartCanvas = await html2canvas(deviceChartSection, {
      scale: 1.1, // Adjust the scale to control the resolution
    });
    pdf.addImage(deviceChartCanvas.toDataURL('image/png'), 'PNG', 120, 430, 80, 90);


    
    

    pdf.save('link_metrics_report.pdf');

    setLoading(false);
  } catch (error) {
    console.error('Error generating PDF:', error);
    setLoading(false);
  }
};









  


  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>
   
   {user.user_id ? (
        <>
         <Grid
         container
         direction="row"
         justifyContent={'space-around'}
         
       >
         <Grid
           item
           xs={6}
           sm={6}
           md={3}
           spacing={1}
           container
           direction="column"
           alignItems="center"
           justifyContent="center"
           marginTop={1}

         >
           <TotalClicks shortId = {linkId} onDataAvailable={handleTotalClicks}/>
         </Grid>
 
         <Grid
           item
           xs={6}
           sm={6}
           md={3}
           spacing={1}
           container
           direction="column"
           alignItems="center"
           justifyContent="center"
           marginTop={1}

         >
         <TotalUniqueClicks shortId = {linkId} onDataAvailable={handleTotalUniqueClicks}/>

         </Grid>


         <Grid
           item
           xs={12}
           sm={12}
           md={4}
           container
           direction="column"
           alignItems="center"
           justifyContent="center"
           marginTop={1}

         >
         <LinkSettingsGrid shortId = {linkId}/>

         </Grid>
 

         </Grid>

         <Box
          
           xs={12}
           sm={12}
           md={6}
         >

{/* <GetChartData shortId = {linkId} /> */}


       {/* chartData  */}

      

        <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px" }}
      >
        <Grid item xs={12} sm={12} md={11}
        >

<Grid   container
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        >

<div id="chart-container"  style= {{ marginBottom : '26px'}}>
      <select value={timeRange} onChange={handleFilterChange}>
        <option value="last7Days">Last 7 Days</option>
        <option value="last30Days">Last 30 Days</option>
        <option value="custom">Custom</option>
      </select>
      {timeRange === 'custom' && (
        <Flatpickr
          options={{ mode: 'range', dateFormat: 'Y-m-d' }}
          value={selectedDates}
          onChange={(dates) => setSelectedDates(dates)}
          onFocus={() => setSelectedDates([null, null])} 
          placeholder='Select Date Range'

         
        />
      )}

    </div>

</Grid>

            <ClicksDateChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} startDate = {startDate}  endDate = {endDate}/>
    
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

          {/* <Typography sx={{ textAlign: 'center'}}>Top 5 Cities ( Total Clicks )</Typography> */}
            <ClicksCityChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} startDate = {startDate}  endDate = {endDate}/>
    
        </Grid>

        <Grid item xs={12} sm={12} md={6} >
            {/* <Typography sx={{ textAlign: 'center'}}>Top 5 Regions ( Total Clicks )</Typography> */}
            <ClicksRegionChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} startDate = {startDate}  endDate = {endDate}/>
    
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
            {/* <Typography sx={{ textAlign: 'center'}}>Top 5 Countries ( Total Clicks )</Typography> */}
            <ClicksCountryChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} startDate = {startDate}  endDate = {endDate}/>
    
        </Grid>

     
      </Grid>

    <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: "64px", marginBottom: "64px"}}
        
      >
        <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ClicksBrowserChart  uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} startDate = {startDate}  endDate = {endDate}/>
        </Grid>

        <Grid item xs={12} sm={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ClicksDevicetypeChart uniqueVisitors={uniqueVisitors} repeatVisitors={repeatVisitors} startDate = {startDate}  endDate = {endDate}/>
        </Grid>

      </Grid>



         </Box>



        </>
       
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    
    </>

  );
}
