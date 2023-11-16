import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgress, Grid} from "@mui/material";
import { Stack} from "@mui/material";
import sideImage from '../../images/banner2.jpg'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from "@mui/material/DialogContentText";
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';




export default function CampaignsShownInterestedByCreator() {

  const navigate = useNavigate();
  const user = useSelector(state => state.creatorUser);
  const [userId, setUserId] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://13.234.41.129:8000/api";





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

    setTimeout(()=>{

  

    axios.post(baseUrl + "/creator/myCampaigns", {
      userId: user.creator_id,
    }).then(ress=>{

      setCampaignData(ress.data.campaigns);
      console.log('Dataaaa', ress.data.campaigns);
      setUserId(user.creator_id);
      setLoading(false);


    }).catch(e=>{

    })
}, 1000);
  }, []);

  const onShowDetails = (campaignId) => {
    console.log('Campaign id', campaignId);

    navigate(`/creator/interested/campaign/details?campaignId=${campaignId}`);

  };


  return (
    <>
 {user.isLoggedIn ? ( !loading ? 
  
  
  (<Grid container spacing={1} direction='row'  sx={{marginTop:'64px', borderTop:'1'}}>        

{campaignData.map((item) =>


( <Grid item xs={12} md={4} container
spacing={0}
direction="column"
alignItems="center"
justifyContent="center"
>

<Card xs={6} md={3} sx={{ width: '100%', cursor: "pointer" }} onClick={()=>{onShowDetails(item.campaign_id)}} >
  <CardHeader
    avatar={
      <Avatar aria-label="logo" src={item.brand_logo}/>
    }
    action={
        <IconButton onClick={handleOpenDialog}>
        </IconButton>
      }
    title={item.brand_name}
    subheader={item.brand_category}
  />

    <Stack direction='column'>


  <CardContent sx={{marginLeft: '56px'}}>

<Typography sx={{color: 'black', fontSize : '16px'}}>
    {(item.campaign_name).slice(0, 100)+'...'}
    </Typography>

    <Stack direction='row' spacing={1} marginTop={1}>

    <Typography sx={{color: 'black', background: '#D0A2F7', maxWidth: '100px', paddingX : '10px', borderRadius: '2px'}}>
    {item.fileType}
    </Typography>

    <Typography sx={{color: 'black', background: '#FF6C22', maxWidth: '100px', paddingX : '10px', borderRadius: '2px' }}>
    Rs. {item.costPerPost}
    </Typography>

    <InstagramIcon />

    </Stack>


    <Tooltip
          title={ item.status ==='Shown Interest' ? ("You have already showed Interest to the campaign. The Brand will Approve your request soon.") :
        ("Your request has been approved. Click 'View Details' for more info.")}
          placement='top'
          sx={{fontSize : '20px'}}
        >
      <Button endIcon={<DoneAllIcon />} variant="outlined" color="secondary" size="small" sx={{marginRight: '5px', marginTop: '16px'}}>
        {item.status}
      </Button>
      </Tooltip>
  </CardContent>
  </Stack>
 
 
</Card> 
</Grid> )

    )}

</Grid>) : <CircularProgress />) : ( <Typography>Please login</Typography> )}


    </>
  );

//   return (
//     <>
//  {user.isLoggedIn ? (!loading ? (

//     <Grid container spacing={1} direction='row'  sx={{marginTop:'64px', borderTop:'1'}}>        
//     {campaignData.map((item) =>  ( <Grid item xs={6} sm={6} md={6} container
//         spacing={0}
//         direction="column"
//         alignItems="center"
//         justifyContent="center"
//         >
      
//       <Card xs={6} sm={6} md={3} sx={{ maxWidth: 500 }}>
//             <CardHeader
//               avatar={
//                 <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//                   {(item.brand_logo).slice(0,1)}
//                 </Avatar>
//               }
//               action={
//                   <IconButton onClick={handleOpenDialog}>
//                   </IconButton>
//                 }
//               title={item.brand_name}
//               subheader={item.brand_category}
//             />
//               <Stack direction='row'>
//             <CardMedia
//               component="img"
//               height="200"
//               image={sideImage}
//               alt="Paella dish"
//               sx={{paddingLeft: '10px'}}
//             />
//             <CardContent>
             
//               <Typography variant="body2" color="text.secondary" sx={{marginBottom: '30px', wordWrap: 'break-word'}}>
//                Caption: {(item.caption).slice(0, 80)+'...'}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{marginBottom: '5px'}}>
//               {/* Publish Date: {new Date(item.publishDate).toISOString().slice(0, 10)} */}
//               </Typography>
//             </CardContent>
//             </Stack>
           
//            <CardContent style={{ display: 'flex', justifyContent: 'flex-end' }}>
      
          
//                 <Tooltip
//           title={ item.status ==='Shown Interest' ? ("You have already showed Interest to the campaign. The Brand will Approve your request soon.") :
//         ("Your request has been approved. Click 'View Details' for more info.")}
//           placement='top'
//           sx={{fontSize : '20px'}}
//         >
//       <Button endIcon={<DoneAllIcon />} variant="outlined" color="secondary" sx={{marginRight: '5px'}}>
//         {item.status}
//       </Button>
//       </Tooltip>
      
//               <Button variant="outlined" color="primary" onClick={()=>{onShowDetails(item.campaign_id)}}>
//                 View Details
//               </Button>
//             </CardContent>
//           </Card> 
//           </Grid>
//           ))} 
   

//     </Grid>): <CircularProgress />) : ( <Typography>Please login</Typography> )}


//     </>
//   );
     
   
}