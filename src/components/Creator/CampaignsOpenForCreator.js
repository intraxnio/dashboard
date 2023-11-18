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
import { Grid} from "@mui/material";
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
import CircularProgress from '@mui/material/CircularProgress';
import {useNavigate } from "react-router-dom";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import InstagramIcon from '@mui/icons-material/Instagram';


export default function CampaignsOpenForCreator() {

  const navigate = useNavigate();
  const user = useSelector(state => state.creatorUser);
  const [userId, setUserId] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://13.234.41.129:8000/api";





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

    if(user.creator_id){


  axios.post("/api/creator/get-campaigns", {
      userId: user.creator_id,
    }).then(ress=>{

      setCampaignData(ress.data.data);
      setUserId(user.creator_id);
      setLoading(false)


    }).catch(e=>{

    })
  }

  else if(!user.creator_id){
    navigate("/login/creator");

  }

  }, []);

  const onShowDetails = (campaignId) => {

    // window.open(`/campaign/details?campaignId=${campaignId}`, '_blank');
    navigate(`/creator/campaign/details?campaignId=${campaignId}`);

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

<Card xs={6} md={3} sx={{ width: '100%', cursor: "pointer" }} onClick={()=>{onShowDetails(item._id)}} >
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
      {/* { item.fileType === 'image' ? (
         <CardMedia
         component="img"
         image={item.mediaFiles[0]}
         alt="Paella dish"
         sx={{paddingLeft: '10px', maxHeight : '140px'}}
       />
      ) : (
       <div sx={{ flex: 1, alignItems: 'center', justifyContent: 'center',  height: 200, width: 100, borderRadius: 5, borderWidth: '0.2px', borderColor: 'green'}}>

                <PlayCircleOutlineIcon />
       </div>
      )} */}


  <CardContent sx={{marginLeft: '56px'}}>
    {/* <Typography variant="body2" color="text.secondary" sx={{marginBottom: '14px', wordWrap: 'break-word', fontSize : '16px'}}>
     Caption: {(item.caption).slice(0, 80)+'...'}
    </Typography>
    <Typography variant="body2" color="text.secondary">
    Publish Date: {new Date(item.publishDate).toISOString().slice(0, 10)}
    </Typography> */}

    {/* <CardContent style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Button variant="outlined" color="primary" onClick={()=>{onShowDetails(item._id)}}>
      View Details
    </Button>
    </CardContent> */}

<Typography sx={{color: 'black', fontSize : '16px'}}>
    {(item.campaign_name).slice(0, 100)+'...'}
    </Typography>

<Typography variant="body2" sx={{color: 'black'}}>
    {/* Ends in: {new Date(item.publishDate).toISOString().slice(0, 10)} */}
    Ends in: 8 days
    </Typography>

    <Stack direction='row' spacing={1} marginTop={1}>

    <Typography sx={{color: 'black', background: '#D0A2F7', maxWidth: '100px', paddingX : '10px', borderRadius: '2px'}}>
    {item.fileType}
    </Typography>

    <Typography sx={{color: 'black', background: '#FF6C22', maxWidth: '100px', paddingX : '10px', borderRadius: '2px' }}>
    Rs. {item.fileType === 'video' ? (item.cost_per_post_video) : (item.cost_per_post_image)}
    </Typography>

    <InstagramIcon />

    </Stack>


  </CardContent>
  </Stack>
 
 
</Card> 
</Grid> )

    )}

</Grid>) : <CircularProgress />) : ( <Typography>Please login</Typography> )}


    </>
  );
     
   
}