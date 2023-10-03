import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Button } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';




export default function CampaignMetricsIndividualPosts({campaignId}) {

    const user = useSelector(state => state.brandUser);
    const [creatorsData, setCreatorsData] = useState([]);
    const [loading, setLoading] = useState(true);



useEffect(() => {
    setTimeout(()=>{
    // axios.post("http://localhost:8000/api/v1/brand/completed-campaign-metrics-table", {
      axios.post("https://app.buzzreach.in/api/v1/brand/completed-campaign-metrics-table", {
        campaignId: campaignId,
      }).then(ress=>{
        
      setCreatorsData(ress.data.data);
      setLoading(false);
        
  
      }).catch(e=>{
  
      })
    }, 1000)
  }, []);



const columns = [
  { field: 'id', headerName: 'S.No', width: 50 },
  { field: 'avatar', headerName: '', renderCell: (params) => <img src={params.value} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> },
  {
    field: 'creatorName',
    headerName:'Influencer',
    width: 200,
    renderCell: (params) => (
      <Button
        endIcon={<ArrowRightIcon />}
        onClick={() => window.open(params.row.profile, '_blank')}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#C70039',
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }}
      >{params.value}
      </Button>
    ),
  },
  {
    field: 'postDetails',
    headerName:'Instagram Post',
    width: 180,
    renderCell: (params) => (
      <Button
        onClick={() => window.open(params.value, '_blank')}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#1FAB89',
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }}
      >Post Details
      </Button>
    ),
  },
  { field: 'impressions', headerName: 'Impressions', width: 110 },
  { field: 'reach', headerName: 'Reach', width: 130, },
  { 
    field: 'pricePerPost', 
    headerName: 'Price Per Post', 
    width: 120,
    renderCell: (params) => `Rs. ${params.value}`
  },

  { 
    field: 'pricePerReach', 
    headerName: 'Price Per Reach', 
    width: 120,
    renderCell: (params) => `Rs. ${params.value}/-`
  },
 


// {
//   field: 'actions',
//   headerName: 'Actions',
//   width: 200,
//   renderCell: (params) => (
//     <div>
//       {params.row.status === 'Requested' && (
//         <>
//           <Button variant='outlined' color='error' size = 'small' sx={{ marginRight: '5px'}} onClick={() => handleDecline(params.row)}>Decline</Button>
//           <Button variant='outlined' color='success' size = 'small'  onClick={() => handleAccept(params.row)}>Accept</Button>
//         </>
//       )}
//       {params.row.status === 'Accepted' && (
//         <Button variant='outlined' color='error' size = 'small' onClick={() => handleDecline(params.row)}>Decline</Button>

//       )}
//       {params.row.status === 'Declined' && (
//         <Button variant='outlined' color='success' size = 'small'  onClick={() => handleAccept(params.row)}>Accept</Button>

//       )}
//       {params.row.status === 'OnGoing' && (
//         <Button variant='contained' color='success' size = 'small' >OnGoing</Button>

//       )}
//        {params.row.status === 'Completed' && (
//         <Button variant='contained' color='secondary' size = 'small' >Completed</Button>

//       )}
//     </div>
//   ),
// },


];

const rows = creatorsData;


  return (
<>
    {loading ? (<CircularProgress />) : (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        initialState={{
          // pagination: {
          //   paginationModel: { page: 0, pageSize: 10 },
          // },
        }}
        pageSizeOptions={[10, 20]}
        // checkboxSelection
      />
    </div> )}
    </>
  );
}
