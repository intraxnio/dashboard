// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
// import Avatar from '@mui/material/Avatar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import { red } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { Grid} from "@mui/material";
// import Box from "@mui/material/Box";
// import sideImage from '../images/banner2.jpg'
// import DeleteIcon from '@mui/icons-material/Delete';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContentText from "@mui/material/DialogContentText";
// import Chip from '@mui/material/Chip';
// import {useNavigate } from "react-router-dom";



// export default function CampaignCard() {

//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [campaignData, setCampaignData] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);


//   const makeFirstRequest = () => {
//     return axios.get("http://localhost:8000/api/v1/brand/getUser", {
//         withCredentials: true
//       });
//   };

//   const makeSecondRequest = (id) => {
//     return axios.post("http://localhost:8000/api/v1/brand/all-campaigns", {
//         userId: id });
//   };

  

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleDelete = () => {
//     // Perform delete action here
//     handleCloseDialog();
//   };

  
// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const firstResponse = await makeFirstRequest();
//         if(firstResponse.data.data == null){
//             setIsLoggedIn(false);
//         }
//         else{
//         setUserId(firstResponse.data.data);
//         setIsLoggedIn(true);

//         const secondResponse = await makeSecondRequest(firstResponse.data.data);
//         setCampaignData(secondResponse.data.data);
//         console.log('response:', secondResponse);
//     }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

//   const createCampaign = async (e) => {
//     e.preventDefault();

//       navigate("/campaign");
//       window.location.reload(true);
//   };

//   const onShowDetails = (campaignId) => {
//     // Redirect to another page with campaignId and userId
//     navigate(`/brand/campaign/details?campaignId=${campaignId}`);
//   };

//   return (
//     <>
//  {isLoggedIn ? (

//     <Grid container spacing={1} direction='row' alignItems='center'  sx={{marginTop:'64px', borderTop:'1'}}>

//         {/* create new campaign grid starts... */}
//         <Grid item xs={6} sm={6} md={3} container spacing={0}>
//     <Card xs={6} sm={6} md={3} sx={{ minWidth: 320, minHeight: 320}}>
     
//      <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//           <Button variant="contained" color="primary" onClick={createCampaign}>
//             + New Campaign
//           </Button>
        
//       </CardContent>
//     </Card>
//     </Grid> 
//         {/* create new campaign grid ends... */}

        

//     {campaignData.map((item) => (
//     <Grid item xs={6} sm={6} md={4} container
//   spacing={0}
//   direction="column"
//   alignItems="center"
//   justifyContent="center">


//     <Card xs={6} sm={6} md={4} sx={{ maxWidth: 400 }}>
//       <CardHeader
//         avatar={
//           <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//             {(item.brand_name).slice(0,1)}
//           </Avatar>
//         }
//         action={
//             <IconButton onClick={handleOpenDialog}>
//               <MoreVertIcon />
//             </IconButton>
//           }
//         title={item.brand_name}
//         subheader={new Date(item.created_at).toISOString().slice(0, 10)}
//       />

//       <CardMedia
//         component="img"
//         height="194"
//         image={sideImage}
//         alt="Paella dish"
//       />
//       <Chip
//           size='small'
//           label = {item.is_onGoing ? 'OnGoing' : 'Completed'}
//           variant="contained"
//           color= {item.is_onGoing ? 'success' : 'error'}
//           style={{ marginLeft: '8px', marginTop: '10px' }}
//         />
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this item?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="secondary">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <CardContent>
//         <Typography variant="body2" color="text.secondary" sx={{marginBottom: '30px'}}>
//          Title:  {(item.title).slice(0, 75)+'...'}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{marginBottom: '30px'}}>
//          Description: {(item.description).slice(0, 100)+'...'}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{marginBottom: '30px'}}>
//         Publish Date: {new Date(item.publishDate).toISOString().slice(0, 10)}
//         </Typography>
//       </CardContent>
     
//      <CardContent style={{ display: 'flex', justifyContent: 'flex-end' }}>
//      <Button variant="outlined" color="primary" onClick={()=>{onShowDetails(item._id)}}>
//           View Details
//         </Button>
//       </CardContent>
//     </Card>
//     </Grid> 
// ))}

//     </Grid>
//      ) : ( <Typography>Please login</Typography> )}


//     </>
//   );
     
   
// }