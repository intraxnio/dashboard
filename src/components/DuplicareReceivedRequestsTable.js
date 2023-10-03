// import React, { useState, useEffect } from "react";
// import { DataGrid } from '@mui/x-data-grid';
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button } from "@mui/material";
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';


// export default function ReceivedRequestsTable() {

// const location = useLocation();
// const navigate = useNavigate();
// const searchParams = new URLSearchParams(location.search);
// const campaignId = searchParams.get("campaignId");
// const [userId, setUserId] = useState("");
// const [isLoggedIn, setIsLoggedIn] = useState(false);
// const [campaignData, setCampaignData] = useState([]);
// const [creatorsData, setCreatorsData] = useState([]);
// const [requests, setRequests] = useState([]);


// const makeFirstRequest = () => {
//   return axios.get("http://localhost:8000/api/v1/brand/getUser", {
//       withCredentials: true
//     });
// };

// const makeSecondRequest = (id) => {
//   return axios.post("http://localhost:8000/api/v1/brand/get-campaign-details", {
//       userId: id, campaignId: campaignId });
// };

// const makeThirdRequest = () => {
//   return axios.post("http://localhost:8000/api/v1/brand/campaign/check-shown-interest", {
//       userId: userId, campaignId: campaignId });
// };

// const makeFourthRequest = () => {
//   return axios.post("http://localhost:8000/api/v1/brand/campaign/get-interested-creators-data", {
//       userId: userId, campaignId: campaignId, interestedCreatorsIds: requests });
// };

// useEffect(() => {
//   const fetchData = async () => {


//     try {
//       const firstResponse = await makeFirstRequest();
//       if(firstResponse.data.data == null){
//           setIsLoggedIn(false);
//       }
//       else{
//       setUserId(firstResponse.data.data);
//       setIsLoggedIn(true);

//       const secondResponse = await makeSecondRequest(firstResponse.data.data);
//       setCampaignData(secondResponse.data.data);
//       console.log('Campaign Data:::', campaignData);

//       const thirdResponse = await makeThirdRequest();
//       setRequests(thirdResponse.data.data);
//       console.log('Interested Requests:::::', requests);

//       const fourthResponse = await makeFourthRequest();
//       setCreatorsData(fourthResponse.data.data);

//       console.log('response:', requests);
//   }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   fetchData();
// }, []);


// const showCreatorDetails = (creatorId) => {
//   // Redirect to another page with campaignId and userId
//   window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
// };

// const handleAccept = (creatorId) => {
//   // Redirect to another page with campaignId and userId
//   window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
// };const handleDecline = (creatorId) => {
//   // Redirect to another page with campaignId and userId
//   window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
// };


// const columns = [
//   { field: 'id', headerName: 'S.No', width: 50 },
//   { field: 'avatar', headerName: '', renderCell: (params) => <img src={params.value} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> },
//   { field: 'creatorName', headerName: 'Name', width: 150 },
//   { field: 'category', headerName: 'Category', width: 130 },
//   { field: 'followers', headerName: 'Followers', width: 80, },
//   { 
//     field: 'pricePerPost', 
//     headerName: 'Price Per Post', 
//     width: 120,
//     renderCell: (params) => `Rs. ${params.value}`
//   },
//   {
//     field: 'profile',
//     headerName:'Instagram',
//     width: 180,
//     renderCell: (params) => (
//       <Button
//         endIcon={<ArrowRightIcon />}
//         onClick={() => window.open(params.value, '_blank')}
//         style={{
//           backgroundColor: 'transparent',
//           border: 'none',
//           color: '#C70039',
//           cursor: 'pointer',
//           textDecoration: 'none',
//           textTransform: 'none'
//         }}
//       >
//         Instagram Profile
//       </Button>
//     ),
//   },
//   {
//     field: 'insights',
//     headerName: 'Insights',
//     width: 100,
//     renderCell: (params) => (
//         <span
//             onClick={() => showCreatorDetails(params.row.influencer_id)} // Pass the ID or necessary parameter
//             style={{ cursor: 'pointer', color: 'blue' }}
//         >
//             Insights
//         </span>
//     ),
// },
// {   
//   field: 'status', 
//   headerName: 'Status', 
//   width: 120,
//   renderCell: (params) => (
//     <button
//       style={{
//         backgroundColor: 'transparent',
//         border: 'none',
//         color: '#F94C10',
//         cursor: 'pointer',
//         textDecoration: 'none',
//       }}
//     >
//       {params.value}
//     </button>
//   ),

//   },
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


// ];

// const rows = creatorsData;


//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         disableSelectionOnClick
//         initialState={{
//           // pagination: {
//           //   paginationModel: { page: 0, pageSize: 10 },
//           // },
//         }}
//         pageSizeOptions={[10, 20]}
//         // checkboxSelection
//       />
//     </div>
//   );
// }
