// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
// import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import { red } from "@mui/material/colors";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { Grid } from "@mui/material";
// import sideImage from "../images/banner2.jpg";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Chip from "@mui/material/Chip";
// import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
// import SendIcon from "@mui/icons-material/Send";
// import { TextField } from "@mui/material";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import { useSelector } from "react-redux";
// import CircularProgress from '@mui/material/CircularProgress';
// import { Stack} from "@mui/material";




// export default function DuplicatePublishCampaignCreator() {

//   const user = useSelector(state => state.creatorUser);
//   const [userId, setUserId] = useState("");
//   const [campaignData, setCampaignData] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
//   const [postedDialogOpen, setPostedDialogOpen] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [loading, setLoading] = useState(true);




//   const handleOpenDialog = (campaign) => {
//     setSelectedCampaign(campaign);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleConfirmationDialogOpen = () => {
//     setConfirmationDialogOpen(true);
//   };

//   const handlepostedDialogOpen = () => {
//     setPostedDialogOpen(true);
//   };

//   const handleConfirmationDialogClose = () => {
//     setConfirmationDialogOpen(false);
//   };

//   const handlePostedDialogClose = () => {
//     setPostedDialogOpen(false);
//   };

//   const submitPost = () => {
//     handleConfirmationDialogOpen();
//   };

//   const handleConfirmPost = (campaign_id, brandUser_id) => {
//     axios
//       .post("http://localhost:8000/api/v1/creator/campaign/publishNow", {
//         influencer_id: userId,
//         campaign_id: campaign_id,
//         media_id: "18022611298510911",
//         brandUser_id: brandUser_id,
//       })
//       .then(() => {
//         setOpenDialog(false);
//         setConfirmationDialogOpen(false);
//       })
//       .catch((error) => {
//         // Handle error if needed
//       });
//   };


//   useEffect(() => {

//     setTimeout(()=>{
      

//     axios.post("http://localhost:8000/api/v1/creator/approved/campaigns", {
//       userId: user.creator_id,
//     }).then(ress=>{

//       setCampaignData(ress.data.data);
//       setUserId(user.creator_id);
//       setLoading(false);


//     }).catch(e=>{

//     })
//   }, 1000);
//   }, []);

//   const onShowDetails = (campaignId) => {
//     // Redirect to another page with campaignId and userId
//     // navigate(`/campaign/details?campaignId=${campaignId}`);
//     window.open(`/campaign/details?campaignId=${campaignId}`, "_blank");
//   };

//   const reloadPageFun = () => {
//     window.location.reload();
//   };



//   return (
//     <>
//       {user.isLoggedIn ? (
//         <Grid
//           container
//           spacing={1}
//           direction="row"
//           alignItems="center"
//           sx={{ marginTop: "64px", borderTop: "1" }}
//         >
//           {campaignData.map((item) => (
//             <Grid
//               item
//               xs={6}
//               sm={6}
//               md={6}
//               container
//               spacing={0}
//               direction="column"
//               alignItems="center"
//               justifyContent="center"
//             >
//               <Card xs={6} sm={6} md={3} sx={{ maxWidth: 400 }}>
//                 <CardHeader
//                   avatar={
//                     <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
//                       {item.brand_name.slice(0, 1)}
//                     </Avatar>
//                   }
//                   action={
//                     <IconButton onClick={handleOpenDialog}>
//                       <MoreVertIcon />
//                     </IconButton>
//                   }
//                   title={item.brand_name}
//                   subheader={new Date(item.created_at)
//                     .toISOString()
//                     .slice(0, 10)}
//                 />

//                 <CardMedia
//                   component="img"
//                   height="194"
//                   image={sideImage}
//                   alt="Paella dish"
//                 />
//                 <Chip
//                   size="small"
//                   label="Ongoing"
//                   variant="outlined"
//                   color="success"
//                   style={{ marginLeft: "8px", marginTop: "10px" }}
//                 />
//                 <CardContent>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ marginBottom: "30px" }}
//                   >
//                     Title: {item.title.slice(0, 75) + "..."}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ marginBottom: "30px", wordWrap: "break-word" }}
//                   >
//                     Description: {item.description.slice(0, 100) + "..."}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ marginBottom: "5px" }}
//                   >
//                     Publish Date:{" "}
//                     {new Date(item.publishDate).toISOString().slice(0, 10)}
//                   </Typography>
//                 </CardContent>

//                 <CardContent
//                   style={{ display: "flex", justifyContent: "flex-end" }}
//                 >
//                   {/* onclick publish button opens the dialogue box with required details - start  */}
//                   {selectedCampaign && (
//                     <Dialog
//                       open={openDialog}
//                       onClose={handleCloseDialog}
//                       PaperProps={{
//                         style: { width: "800px", maxWidth: "90%" },
//                       }}
//                       disableBackdropClick
//                       disableEscapeKeyDown
//                     >
//                       <DialogTitle>Instagram Post</DialogTitle>
//                       <DialogContent>
//                         <Grid container spacing={2}>
//                           <Grid item>
//                             <CardMedia
//                               component="img"
//                               alt="Image"
//                               height="400"
//                               image={sideImage}
//                             />
//                           </Grid>
//                           <Grid item>
//                             <TextField
//                               label="Caption"
//                               value={`${item.title}\n\n${item.description}\n\n${item.description}`}
//                               InputProps={{
//                                 readOnly: true,
//                               }}
//                               multiline
//                               fullWidth
//                               rows={15}
//                               variant="outlined"
//                               sx={{ marginTop: "20px", width: "400px" }}
//                             />
//                           </Grid>
//                         </Grid>
//                       </DialogContent>
//                       <DialogActions>
//                         <Button onClick={handleCloseDialog} color="primary">
//                           Cancel
//                         </Button>
//                         <Button onClick={submitPost} color="success">
//                           Post
//                         </Button>
//                       </DialogActions>
//                     </Dialog>
//                   )}

//                   <Dialog
//                     open={confirmationDialogOpen}
//                     onClose={handleConfirmationDialogClose}
//                     disableBackdropClick
//                     disableEscapeKeyDown
//                   >
//                     <DialogTitle>Confirm Post</DialogTitle>
//                     <DialogContent>
//                       Are you sure you want to post this to your Instagram Page?
//                     </DialogContent>
//                     <DialogActions>
//                       <Button
//                         onClick={handleConfirmationDialogClose}
//                         color="primary"
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         onClick={() => {
//                           handleConfirmPost(item._id, item.brandUser_id);
//                           handlepostedDialogOpen();
//                         }}
//                         color="success"
//                       >
//                         YES
//                       </Button>
//                     </DialogActions>
//                   </Dialog>

//                   <Dialog
//                     open={postedDialogOpen}
//                     onClose={handlePostedDialogClose}
//                     disableBackdropClick
//                     disableEscapeKeyDown
//                   >
//                     <DialogTitle
//                       disableTypography
//                       sx={{ display: "flex", alignItems: "center" }}
//                     >
//                       <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
//                         <DoneAllIcon />
//                       </Avatar>
//                       <Typography variant="h6">Success</Typography>
//                     </DialogTitle>
//                     <DialogContent>
//                       The campaign has been successfully posted on your
//                       Instagram page.
//                       <br />
//                       <br /> Let our system verify this and with-in 24hrs the
//                       funds will get disbursed. <br />
//                       <br />
//                       Thank you!
//                     </DialogContent>
//                     <DialogActions>
//                       <Button
//                         onClick={() => {
//                           reloadPageFun();
//                           handlePostedDialogClose();
//                         }}
//                         color="primary"
//                       >
//                         OK
//                       </Button>
//                     </DialogActions>
//                   </Dialog>

//                   {/* onclick publish button opens the dialogue box with required details- end */}

//                   <Button
//                     endIcon={<ScheduleSendIcon />}
//                     variant="contained"
//                     color="secondary"
//                     sx={{ marginRight: "5px" }}
//                     onClick={() => {
//                       onShowDetails(item._id);
//                     }}
//                   >
//                     Schedule Post
//                   </Button>
//                   <Button
//                     endIcon={<SendIcon />}
//                     variant="outlined"
//                     color="success"
//                     onClick={() => handleOpenDialog(item._id)}
//                   >
//                     Publish Now
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Typography>Please login</Typography>
//       )}
//     </>
//   );
// }
