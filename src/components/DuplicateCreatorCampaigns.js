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
import sideImage from '../images/banner2.jpg'
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


export default function DuplicateCreatorCampaigns() {

  const user = useSelector(state => state.creatorUser);
  const [userId, setUserId] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);



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

    axios.post("http://localhost:8000/api/v1/creator/get-campaigns", {
      userId: user.creator_id,
    }).then(ress=>{

      setCampaignData(ress.data.data);
      setUserId(user.creator_id);


    }).catch(e=>{

    })
  }, []);

  const onShowDetails = (campaignId) => {

    window.open(`/campaign/details?campaignId=${campaignId}`, '_blank');
  };

  return (
    <>
 {user.isLoggedIn ? (

    <Grid container spacing={1} direction='row'  sx={{marginTop:'64px', borderTop:'1'}}>        

    {campaignData.map((item) => (
    <Grid item xs={6} sm={6} md={6} container
  spacing={0}
  direction="column"
  alignItems="center"
  justifyContent="center">


    <Card xs={6} sm={6} md={3} sx={{ maxWidth: 500 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {(item.brand_name).slice(0,1)}
          </Avatar>
        }
        action={
            <IconButton onClick={handleOpenDialog}>
            </IconButton>
          }
        title={item.brand_name}
        subheader={new Date(item.created_at).toISOString().slice(0, 10)}
      />
        <Stack direction='row'>
      <CardMedia
        component="img"
        height="200"
        image={sideImage}
        alt="Paella dish"
        sx={{paddingLeft: '10px'}}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{marginBottom: '30px'}}>
         Title: {(item.title).slice(0, 40)+'...'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{marginBottom: '30px', wordWrap: 'break-word'}}>
         Description: {(item.description).slice(0, 80)+'...'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{marginBottom: '5px'}}>
        Publish Date: {new Date(item.publishDate).toISOString().slice(0, 10)}
        </Typography>
      </CardContent>
      </Stack>
     
     <CardContent style={{ display: 'flex', justifyContent: 'flex-end' }}>

     {
  (item.received_interests.includes(userId)) ? (
    <Tooltip
    title={item.received_interests.includes(userId) ? "You have already showed Interest to the campaign. The Brand will Approve your request soon." : "Show Interest"}
    placement='top'
  >
 <Button endIcon={<DoneAllIcon />} variant="outlined" color="secondary" sx={{marginRight: '5px'}}>
  Shown Interest
 </Button>
 </Tooltip>) : ''
 
}


{
  (item.accepted_interests.includes(userId)) ? (
    <Tooltip
    title={item.accepted_interests.includes(userId) ? "Congratulations! your request has been approved. Check ' Publish ' section to publish the POST." : "Show Interest"}
    placement='top'
  >
 <Button endIcon={<DoneAllIcon />} variant="contained" color="success" sx={{marginRight: '5px'}}>
  Approved
 </Button>
 </Tooltip>) : ''
 
}


     

        <Button variant="outlined" color="primary" onClick={()=>{onShowDetails(item._id)}}>
          View Details
        </Button>
      </CardContent>
    </Card>
    </Grid> 
))}

    </Grid>
     ) : ( <Typography>Please login</Typography> )}


    </>
  );
     
   
}