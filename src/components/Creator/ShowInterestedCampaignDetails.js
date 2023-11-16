import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle
} from "@mui/material";
import axios from "axios";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel"; // Import Carousel component
import ReactPlayer from "react-player";
import { format, isValid } from 'date-fns-tz';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Confetti from "react-confetti";









function ShowInterestedCampaignDetails() {

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");
  const user = useSelector(state => state.creatorUser);
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alreadyShowedInterest, setAlreadyShowedInterest] = useState();
  const [campaignData, setCampaignData] = useState([]);
  const [price, setPrice] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialogNotInterested, setOpenDialogNotInterested] = useState(false);
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [showConfetti, setShowConfetti] = useState(false);




  const makeSecondRequest = (id) => {
    return axios.post("http://localhost:8000/api/creator/get-myCampaign-details", {
        userId: id, campaignId: campaignId });
  };



  const fetchData = async () => {
    try {
      const secondResponse = await makeSecondRequest(user.creator_id);
      setCampaignData(secondResponse.data.data);
      setPrice(secondResponse.data.price);

  }
     catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);

   const handleBackClick = () => {
     navigate('/creator/getAllCampaigns'); // Navigate back to the CampaignCard component
 };




  function formatPublishDate(publishDate) {
    const date = new Date(publishDate);
      return format(date, 'dd-MM-yyyy hh:mm:ss a', { timeZone: 'Asia/Kolkata' });
  }

    const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };


  return (
   
   
   <>

 <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick} sx={{marginBottom: '12px'}}>Back</Button>


   <Grid container sx={{ display: 'flex', flexDirection: 'row'}}>


   <Grid item xs={12} sm={6} md={6} lg={4} paddingX={1} marginBottom={1}>
  
  {campaignData && campaignData.fileType === "image" ? (
    <Carousel showArrows={true} showThumbs={false} 
    width="100%"
    maxHeight="80vh"
    overflow='hidden'
    >
      {campaignData.mediaFiles.map((image, index) => (
        <div key={index} >
          <img 
         
          src={image} 
          alt={`Image ${index}`}
          
          />
        </div>
      ))}
    </Carousel>
  ) : campaignData && campaignData.fileType === "video" ? (
    <ReactPlayer
      url={campaignData.mediaFiles[0]} // Assuming there's only one video URL
      width="100%"
      maxHeight="80vh"
      overflow='hidden'
      controls={true} // Show player controls (play, pause, volume, etc.)
    />
  ) : (
    // Render loading indicator or other content while data is being fetched
    <div>Loading...</div>
    )}
    </Grid>


  
  <Grid item xs={12} sm={6} md={6} lg={8}>


    <Box display='flex' flexDirection={'column'} padding={1} >

  
    <TextField
        label="Caption"
        variant="outlined"
        multiline
        InputProps={{ readOnly: true }}
        InputLabelProps={{
          shrink: true, // Move the label up when there's a value
          margin: 'dense', // Adjust the margin to avoid overlap
          transform: 'translate(14px, 16px) scale(1)', // Adjust the label's position
        }}
        rows={9}
        value={campaignData.caption}
        sx={{
          width: '100%',
          marginBottom: '22px',
        }}
      />

      {campaignData.publishDate && (
            <TextField
              label="Publish Date"
              variant="outlined"
              InputProps={{ readOnly: true }}
              InputLabelProps={{
                shrink: true,
                margin: 'dense',
                transform: 'translate(14px, 16px) scale(1)',
              }}
              value={formatPublishDate(campaignData.publishDate)}
              sx={{
                width: '100%',
                marginBottom: '15px',
              }}
            />
          )}

<Button variant="outlined" color="success" size='large' onClick={()=> setOpenDialog2(true) }
        sx={{
            maxWidth: '300px',
            textTransform:'capitalize',
            marginTop: '10px'

            }}>
         Get Paid: Rs. {campaignData.quoted_price}
        </Button>

        <Button variant="outlined" color="success" size='large' onClick={()=> setOpenDialog(true)}
        sx={{
            maxWidth: '300px',
            textTransform:'capitalize',
            marginTop: '10px'

            }}>
         {campaignData.status}
        </Button>



      <Box mt='auto'>
        
      </Box>
      </Box>
      
        </Grid>
      </Grid>



   
{ /*First Dialogue code starts */}

       <Dialog open={openDialog} onClose={handleCloseDialog} disableEscapeKeyDown >
         <DialogTitle>{"Hey!"}</DialogTitle>
         <DialogContent>
           <DialogContentText>
            { campaignData.status === 'Awaiting Approval' ? (" Your Interest has been already sent to the brand. Waiting for Approval") 
            : ("Your request has been approved and Instagram Post will get posted on scheduled date automatically.")}
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button variant="outlined" onClick={()=> {setOpenDialog(false)}} color="primary">
             OK
           </Button>
         </DialogActions>
       </Dialog>

 {/* First Dialogue code ends */}


 { /*First Dialogue code starts */}

       <Dialog open={openDialog2} onClose={handleCloseDialog2} disableEscapeKeyDown >
         <DialogTitle>{"Cheers !!"}</DialogTitle>
         <DialogContent>
           <DialogContentText>
           <Typography>
            Funds will get disbursed with in 24hours after campaign is published on your Instagram Page.
           </Typography>
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button variant="outlined" onClick={()=> {setOpenDialog2(false)}} color="primary">
             OK
           </Button>
         </DialogActions>
       </Dialog>

 {/* First Dialogue code ends */}


      </>
  );


  
}

export default ShowInterestedCampaignDetails;



// ---------------------------------------------------------------------------------------
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Button,
//   Typography,
//   Paper,
//   Box,
//   Grid,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   TextField
// } from "@mui/material";
// import axios from "axios";
// import sideImage from "../../images/banner2.jpg";
// import { useLocation } from "react-router-dom";
// import Tooltip from '@mui/material/Tooltip';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import StepContent from '@mui/material/StepContent';
// import '../../styles/Confetti.css'
// import Confetti from "react-confetti";
// import IconButton from "@mui/material/IconButton";
// import EditIcon from "@mui/icons-material/Edit";



// const steps = [
//   {
//     label: 'Congratulations!!!',
//     description: 'We have sent your request to the Brand. Soon the Brand will '+
//                   'Approve your request for the Campaign',
//   },
//   {
//     label: 'Check Approved Campaigns section',
//     description:
//       'Once your request is Approved. The campaign will be shown in the Approved Campaigns Section moving from Interested Campaigns',
//   },
//   {
//     label: 'Schedule Post',
//     description: `Click 'Schedule Now' button and that's it. The post will get posted on your Instagram Page on the scheduled
//     date and time. The Funds will get released.`,
//   },
// ];

// function ShowCampaignDetails() {

//   const location = useLocation();
//   const navigate = useNavigate();
//   const searchParams = new URLSearchParams(location.search);
//   const campaignId = searchParams.get("campaignId");
//   const user = useSelector(state => state.creatorUser);
//   const [userId, setUserId] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [alreadyShowedInterest, setAlreadyShowedInterest] = useState();
//   const [campaignData, setCampaignData] = useState([]);
//   const [price, setPrice] = useState();
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openDialogNotInterested, setOpenDialogNotInterested] = useState(false);
//   const [interestDialogOpen, setInterestDialogOpen] = useState(false);
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);




//   const makeSecondRequest = (id) => {
//     return axios.post("http://localhost:8000/api/creator/get-campaign-details", {
//         userId: id, campaignId: campaignId });
//   };

//   const makeThirdRequest = () => {
//     return axios.post("http://localhost:8000/api/creator/campaign/check-shown-interest", {
//         userId: user.creator_id, campaignId: campaignId });
//   };


//   const fetchData = async () => {
//     try {
//       const secondResponse = await makeSecondRequest(user.creator_id);
//       setCampaignData(secondResponse.data.data);
//       setPrice(secondResponse.data.price);

//       const thirdResponse = await makeThirdRequest();
//       if(thirdResponse.data.isAvailable){
//         console.log('Third If entered')
//         setAlreadyShowedInterest(true)
//       }
//       else{
//         setAlreadyShowedInterest(false)
//       }

//   }
//      catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {

//     fetchData();
//   }, []);




//   const handleClick = () => {
//     setOpenDialog(true);
//   };

//   const handleClickNotInterested = () => {
//     setOpenDialogNotInterested(true);
//   };


//   const handleShowInterest = async () => {
//     try {

//         axios.post("http://localhost:8000/api/v1/creator/campaign/show-interest", {
//           userId: user.creator_id,
//           campaignId: campaignId,
//           price: price
//         }).then(ress=>{

//           if(ress.data.isAdded){
          
//             setOpenDialog(false);
//             setInterestDialogOpen(true);
//             setShowConfetti(true);
            
//           }
//           else{
//           }
    
//         }).catch(e=>{
    
//         })



     
//     } catch (error) {
//       console.error(error);
//     }
//   };


//   const showNotInterested = async () => {
//     try {

//         axios.post("http://localhost:8000/api/v1/creator/campaign/dont-show-interest", {
//           userId: user.creator_id,
//           campaignId: campaignId,
//           price: price
//         }).then(ress=>{

//           if(ress.data.isDeleted){
         
//             closeNotInterestedDialog();
           

            
//           }
//           else{
//           }
    
//         }).catch(e=>{
    
//         })



     
//     } catch (error) {
//       console.error(error);
//     }
//   };


//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setInterestDialogOpen(false);
//   };

//   const closeNotInterestedDialog = () => {
//     setOpenDialogNotInterested(false);
//     navigate('/creator/getAllCampaigns');

//     // setInterestDialogOpen(false);
//   };


//   const handleBackClick = () => {
//     navigate('/creator/getAllCampaigns'); // Navigate back to the CampaignCard component
//   };

//   const handleConfirmDialogClose = () => {
//     setInterestDialogOpen(false);
//     navigate('/creator/getAllCampaigns');
    

   
//   };


//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

  




  
//   return (
//     <>
//    <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick} sx={{marginBottom: '4px'}}>Back</Button>

//    <Grid container spacing={1} padding={2}>
    
//     <Grid item xs={4} sx={{ maxHeight: '75vh', overflowY: 'auto' }}>
//     <img className="img-fluid" src={sideImage} alt="Passion into Profession" />
//     </Grid>

//     <Grid item xs={8} sx={{ maxHeight: '75vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        
//     <Box display='flex' flexDirection={'column'} margin='auto' padding={1}>
//       <TextField
//         label="Caption"
//         variant="outlined"
//         multiline
//         InputProps={{ readOnly: true }}
//         InputLabelProps={{
//           shrink: true, // Move the label up when there's a value
//           margin: 'dense', // Adjust the margin to avoid overlap
//           transform: 'translate(14px, 16px) scale(1)', // Adjust the label's position
//         }}
//         rows={9}
//         value={campaignData.caption}
//         sx={{
//           width: '100vh',
//           marginBottom: '16px',
//         }}
//       />

//       <TextField
//         label="Publish Date"
//         variant="outlined"
//         InputProps={{ readOnly: true }}
//         InputLabelProps={{
//           shrink: true, // Move the label up when there's a value
//           margin: 'dense', // Adjust the margin to avoid overlap
//           transform: 'translate(14px, 16px) scale(1)', // Adjust the label's position
//         }}
//         value={campaignData.publishDate}
//         sx={{
//           width: '100%',
//           marginBottom: '16px',
//         }}
//         />

// <Box mt='auto'> {/* This pushes the buttons to the bottom */}
// <Button variant="outlined" color="primary" size='large'
//         sx={{
//             // maxWidth: '300px',
//             textTransform:'capitalize',
//             marginBottom: '16px'
            
//         }}>
//          Cost Per Post: Rs.{price}/-
//          <IconButton
//     onClick={() => {
//       // Add your edit action here
//       // For example, open a dialog for editing the cost
//     }}
//     sx={{ ml: 1 }}
//   >
//     <EditIcon sx={{fontSize:'14px'}} />
//   </IconButton>
//         </Button>
//         { alreadyShowedInterest ? (<Button variant="contained" color="success" size='large' onClick={handleClickNotInterested}
//         sx={{
//             // maxWidth: '300px',
//             marginLeft: '30px',
//             textTransform:'capitalize',
//             marginBottom: '16px'}}>
//          Not Interested
//         </Button> ) : (<Button variant="contained" color="success" size='large' onClick={handleClick}
//         sx={{
//             // maxWidth: '300px',
//             marginLeft: '30px',
//             textTransform:'capitalize',
//             marginBottom: '16px',

//             }}>
//          Show Interest
//         </Button> )
// }
//     </Box>

//       </Box>

     
// {/* Button: 'Show Interest'
// First Dialogue code starts */}

//       <Dialog open={openDialog} onClose={handleCloseDialog} disableEscapeKeyDown >
//         <DialogTitle>{"Exciting Opportunity!"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//            "Ready to take your talent to the next level? Confirm your interest in this amazing campaign!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleShowInterest} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>

// {/* First Dialogue code ends */}



// {/* Second Dialogue code starts after clicking 'OK' button */}

//       <Dialog open={interestDialogOpen} onClose={handleCloseDialog} disableBackdropClick disableEscapeKeyDown>
//         <DialogTitle></DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//           <Box sx={{ maxWidth: 400 }}>
//       <Stepper activeStep={activeStep} orientation="vertical">
//         {steps.map((step, index) => (
//           <Step key={step.label}>
//             <StepLabel>
//               {step.label}
//             </StepLabel>
//             <StepContent>
//               <Typography>{step.description}</Typography>
//               <Box sx={{ mb: 2 }}>
//                 <div>
//                 {index !== steps.length - 1 && (
//                   <Button variant="contained" onClick={handleNext}
//                     sx={{ mt: 1, mr: 1 }}
//                   >
//                     Next
//                   </Button>
//                 )}
//                   <Button
//                     disabled={index === 0}
//                     onClick={handleBack}
//                     sx={{ mt: 1, mr: 1 }}
//                   >
//                     Back
//                   </Button>
//                 </div>
//               </Box>
//             </StepContent>
//           </Step>
//         ))}
//       </Stepper>
    
//     </Box>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleConfirmDialogClose} color="secondary" variant="contained" size="large">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>

// {/* Second Dialogue code ends */}


// <Dialog open={openDialogNotInterested} onClose={closeNotInterestedDialog} disableEscapeKeyDown >
//         <DialogTitle>Sad!</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//           Are you sure to withdraw Interest ?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeNotInterestedDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={showNotInterested} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>


//     </Grid>

//    </Grid>


//    {showConfetti && (
//         <Confetti
//           numberOfPieces={150}
//           width={window.innerWidth} // Use window.innerWidth for width
//           height={window.innerHeight} // Use window.innerHeight for height
//         />
//       )}


  
//     </>
//   );
// }

// export default ShowCampaignDetails;
