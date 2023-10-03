import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Button, TableContainer} from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import {Link, useNavigate } from "react-router-dom";
import sideImage from '../../images/banner2.jpg'
import Chip from '@mui/material/Chip';
import { deepOrange, green, purple, blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MoveDownRoundedIcon from '@mui/icons-material/MoveDownRounded';





const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

export default function CampaignCard() {

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [currentCampaignId, setCurrentCampaignId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);



  


  const makeFirstRequest = () => {
    // return axios.get("http://localhost:8000/api/v1/brand/getUser", {
      return axios.get("https://app.buzzreach.in/api/v1/brand/getUser", {
        withCredentials: true
      });
  };

  const makeSecondRequest = (id) => {
    // return axios.post("http://localhost:8000/api/v1/brand/all-campaigns", {
      return axios.post("https://app.buzzreach.in/api/v1/brand/all-campaigns", {
        userId: id });
  };

  

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = () => {
    // Perform delete action here
    handleCloseDialog();
  };

  
useEffect(() => {
    const fetchData = async () => {
      try {
        const firstResponse = await makeFirstRequest();
        if(firstResponse.data.data == null){
            setIsLoggedIn(false);
        }
        else{
        setUserId(firstResponse.data.data);
        setIsLoggedIn(true);

        const secondResponse = await makeSecondRequest(firstResponse.data.data);
        setCampaignData(secondResponse.data.data);
        setLoading(false);
        console.log('response:', secondResponse.data.data);
    }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const createCampaign = async (e) => {
    e.preventDefault();

    // axios.post("http://localhost:8000/api/v1/brand/check-brand-plan-details", {
      axios.post("https://app.buzzreach.in/api/v1/brand/check-brand-plan-details", {
      userId: userId
    }).then(ress=>{

      if(ress.data.onPlan){
      navigate("/brand/campaign");

      }
      else{
        navigate("/brand/planDetails");


      }

    }).catch(e=>{

    })

  };
  
  const onShowDetails = (campaignId) => {
    // navigate(`/brand/campaigns/${campaignId}/details`);
    navigate(`/brand/campaign/requests?campaignId=${campaignId}`);
  };


  const onShowMetrics = (campaignId) => {
    // navigate(`/brand/campaigns/${campaignId}/details`);
    navigate(`/brand/campaign/metrics?campaignId=${campaignId}`);
  };
  



const columns = [
  // { field: 'id', headerName: 'S.No', width: 50 },
  { 
    field: 'id', 
    headerName: 'S.No', 
    width: 50,
  },

  {
    field: 'avatar',
    headerName: '',
    renderCell: (params) => {
      const isImage = params.row.fileType == 'image';
      console.log('Valueeeeee', params.row.fileType);
  
      return (
        <div style={{ width: 60, height: 150, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isImage ? (
             <img src={params.value} alt="Media" style={{ maxWidth: '100%', maxHeight: '100%' }} />
           
          ) : (
            <PlayCircleOutlineIcon />
           
          )}
        </div>
      );
    },
  },

  { 
    field: 'name', 
    headerName: 'Campaign', 
    width: 230,
    renderCell: (params) => (
      <div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {params.value.length > 45
            ? params.value.substr(0, 45) + '...'
            : params.value}
        </div>
      </div>
    ),
  },
  { 
    field: 'createdDate', 
    headerName: 'Created Date', 
    width: 150,
    renderCell: (params) => {
      const date = new Date(params.value);
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      const formattedDate = date.toLocaleDateString('en-US', options);
  
      return (
        <div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {formattedDate}
          </div>
        </div>
      );
    },
  },

  { 
    field: 'publishDate', 
    headerName: 'Publish Date', 
    width: 220,
    renderCell: (params) => (
      <div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {params.value.length > 25
            ? params.value.substr(0, 25)
            : params.value}
        </div>
      </div>
    ),
  },

  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: (params) => (
      <Chip
      size='small'
      label = {params.value ? 'Completed' : 'On - Going'}
      variant="outlined"
      style={{ marginLeft: '8px', marginTop: '10px' }}
    />
    ),
  },

  {
    field: 'campaignId',
    headerName: 'View Details',
    width: 140,
    renderCell: (params) => {
      const isCompleted = params.row.status; // Assuming 'is_completed' is a field in your campaignData
  
      return (
        isCompleted ? (
          <Button variant="outlined" color="secondary" onClick={() => onShowMetrics(params.value)}>
            View Details
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={() => onShowDetails(params.value)}>
          View Details
        </Button>
        )
      );
    },
  },
 


];

const rows = campaignData;




  return (
<>


{/* {showDetails ? (
        <BrandShowCampaignDetails campaignId={currentCampaignId} />
      ) :

   
    ( */}
    <ThemeProvider theme={theme}>
    <TableContainer sx={{marginTop:'40px'}}>
    <Button
        variant="outlined"
        color="primary"
        onClick={createCampaign}
        sx={{ marginBottom: "10px", color: deepOrange[500] }}
        style={{
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }} 
      >
        + New Campaign
      </Button>

    <div style={{ height: '100%', width: '100%' }}>

    {loading ? (<CircularProgress />) : (<>
    {campaignData !== null && campaignData.length !== 0  ? (

      <DataGrid
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        getRowHeight={() => 80} // Set the desired row height
        initialState={{
          // pagination: {
          //   paginationModel: { page: 0, pageSize: 10 },
          // },
        }}
        pageSizeOptions={[10, 20]}
        // checkboxSelection
      />
    ) : ( 
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <iframe
        width="900"
        height="456"
        src='https://www.youtube.com/embed/FrpIhVTlMYc'
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        target="_blank"
      ></iframe>
    </div>
     )}
    </>) }

    </div>


    </TableContainer>
    </ThemeProvider>

    
    </>
  );
}
