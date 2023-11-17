import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useSelector } from "react-redux";
import { Button, TableContainer} from "@mui/material";
import BalanceComponent from "./BalanceComponent";





export default function CampaignDeclinedRequests() {

const location = useLocation();
const navigate = useNavigate();
const searchParams = new URLSearchParams(location.search);
const user = useSelector(state => state.brandUser);
const campaignId = searchParams.get("campaignId");
const [userId, setUserId] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [campaignData, setCampaignData] = useState([]);
// const baseUrl = "http://localhost:8000/api";
const baseUrl = "https://13.234.41.129:8000/api";




useEffect(() => {
      axios.post(baseUrl+"/brand/campaign-declined-requests", {
      campaignId: campaignId
    }).then(ress=>{

        setCampaignData(ress.data.campaignData);
        setUserId(user.brand_id);


    }).catch(e=>{

    })
  }, []);

const showCreatorDetails = (creatorId) => {
  // Redirect to another page with campaignId and userId
  window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
};

const handleAccept = (creatorId) => {
  // Redirect to another page with campaignId and userId
  window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
};const handleDecline = (creatorId) => {
  // Redirect to another page with campaignId and userId
  window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
};


const createCampaign = async (e) => {
    e.preventDefault();

      // navigate("/campaign");
      // window.location.reload(true);
  window.open(`/campaign`, '_blank');

  };

const columns = [
  { field: 'id', headerName: 'S.No', width: 20 },
  { field: 'avatar', headerName: '', renderCell: (params) => <img src={params.value} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> },
  { field: 'creatorName', headerName: 'Name', width: 80 },
  { field: 'category', headerName: 'Category', width: 120 },
  { field: 'followers', headerName: 'Followers', width: 80, },
  { 
    field: 'pricePerPost', 
    headerName: 'Price Per Post', 
    width: 120,
    renderCell: (params) => `Rs. ${params.value}`
  },
  {
    field: 'profile',
    headerName:'Instagram',
    width: 140,
    renderCell: (params) => (
      <Button
        endIcon={<ArrowRightIcon />}
        onClick={() => window.open(params.value, '_blank')}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#C70039',
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }}
      >
        Instagram Profile
      </Button>
    ),
  },
  {
    field: 'insights',
    headerName: 'Insights',
    width: 80,
    renderCell: (params) => (
        <span
            onClick={() => showCreatorDetails(params.row.influencer_id)} // Pass the ID or necessary parameter
            style={{ cursor: 'pointer', color: 'blue' }}
        >
            Insights
        </span>
    ),
},
{   
  field: 'status', 
  headerName: 'Status', 
  width: 100,
  renderCell: (params) => (
    <button
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: '#F94C10',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      {params.value}
    </button>
  ),

  },
{
  field: 'actions',
  headerName: 'Actions',
  width: 160,
  renderCell: (params) => (
    <div>
    {params.row.status === 'Declined' && (
        <Button variant='outlined' color='success' size = 'small'  onClick={() => handleAccept(params.row)}>Accept</Button>

      )}
    </div>
  ),
},


];

const rows = campaignData;


  return (
    <TableContainer sx={{ marginTop: '35px', display: 'flex', flexDirection: 'column', paddingLeft: '10px', paddingRight: '10px'  }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>

   <BalanceComponent />
    </div>
  
    <div style={{ height: '100%', width: '100%' }}>
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
    </div>
  </TableContainer>
  );
}
