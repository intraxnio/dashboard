import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Grid} from "@mui/material";
import { Stack} from "@mui/material";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import {useNavigate } from "react-router-dom";
import PostAddIcon from '@mui/icons-material/PostAdd';
import InstagramIcon from '@mui/icons-material/Instagram';


export default function CampaignsOpenForCreator() {

  const navigate = useNavigate();
  const user = useSelector(state => state.creatorUser);
  const [userId, setUserId] = useState("");
  const [campaignData, setCampaignData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);




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

  const calculateRemainingTime = (endDate) => {
    const currentDate = new Date();
    const endDateTime = new Date(endDate);
    const timeDifference = endDateTime - currentDate;
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (daysRemaining > 0) {
      return `${daysRemaining} days`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining} hours`;
    } else {
      return 'Less than 1 hour';
    }
  };


  return (
    <>

{loading ? (<CircularProgress />) : (<>

      {campaignData !== null && campaignData.length !== 0  ? ( <Grid container spacing={1} direction='row'  sx={{marginTop:'64px', borderTop:'1'}}>        

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

  <CardContent sx={{marginLeft: '56px'}}>

<Typography sx={{color: 'black', fontSize : '16px'}}>
    {(item.campaign_name).slice(0, 100)+'...'}
    </Typography>

<Typography variant="body2" sx={{color: 'black'}}>
    Ends in: {calculateRemainingTime(item.publishDate)}
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

</Grid>) : (
      <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "50vh", // Adjust the height as needed
    }}
  >
    <PostAddIcon style={{ fontSize: '60px', marginBottom: '20px', color: '#5D12D2'}}/>
    <div> No NEW Campaigns</div>
  </div>
    )}
    </>)}



    </>
  );
     
   
}