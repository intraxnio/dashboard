// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import { useSelector } from "react-redux";
// import { Button, TableContainer } from "@mui/material";
// import BalanceComponent from "./BalanceComponent";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Alert from "@mui/material/Alert";
// import { ClickAwayListener } from "@mui/base/ClickAwayListener";

// export default function CampaignNewRequests() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const searchParams = new URLSearchParams(location.search);
//   const user = useSelector((state) => state.brandUser);
//   const campaignId = searchParams.get("campaignId");
//   const [userId, setUserId] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [campaignData, setCampaignData] = useState([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
//   const [currentCampaignId, setCurrentCampaignId] = useState("");
//   const [currentCreatorId, setCurrentCreatorId] = useState("");
//   const [currentScheduledDate, setCurrentScheduledDate] = useState("");
//   const [costPerPost, setCostPerPost] = useState("");
//   const [infoDialogOpen, setInfoDialogOpen] = useState(false);
//   const [infoDialogContent, setInfoDialogContent] = useState("");
//   const [balance, setBalance] = useState("");

//   const handleOpenDialog = (
//     creator_id,
//     campaign_id,
//     publishDate,
//     pricePerPost
//   ) => {
//     setCurrentCreatorId(creator_id);
//     setCurrentCampaignId(campaign_id);
//     setCurrentScheduledDate(publishDate);
//     setCostPerPost(pricePerPost);
//     setIsDialogOpen(true); // Open the dialog
//   };

//   const handleOpenDeclineDialog = (
//     creator_id,
//     campaign_id,
//     publishDate,
//     pricePerPost
//   ) => {
//     setCurrentCreatorId(creator_id);
//     setCurrentCampaignId(campaign_id);
//     setCurrentScheduledDate(publishDate);
//     setCostPerPost(pricePerPost);
//     setIsDeclineDialogOpen(true); // Open the dialog
//   };

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false); // Close the dialog
//   };

//   const handleCloseDeclineDialog = () => {
//     setIsDeclineDialogOpen(false); // Close the dialog
//   };

//   const handleOpenInfoDialog = (content) => {
//     setInfoDialogOpen(true);
//     setInfoDialogContent(content);
//   };

//   const handleCloseInfoDialog = () => {
//     setInfoDialogOpen(false);
//     fetchData();
//   };

//   const handleClickAway = () => {
//     //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
//   };

//   const fetchData = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:8000/api/v1/brand/campaign-new-requests",
//         {
//           campaignId: campaignId,
//         }
//       );

//       const fetchBalance = await axios.post(
//         "http://localhost:8000/api/v1/brand/get-account-balance",
//         {
//           brand_id: user.brand_id,
//         }
//       );

//       setCampaignData(res.data.campaignData);
//       setBalance(fetchBalance.data.balance);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const showCreatorDetails = (creatorId) => {
//     // Redirect to another page with campaignId and userId
//     window.open(`/creator/indiDetails?userId=${creatorId}`, "_blank");
//   };

//   const successContent = (
//     <>
//       <DialogTitle>Congratulations!</DialogTitle>
//       <DialogContent>
//         Creator request for Campaign Promotion has been Approved.
//         <br />
//         Creator will get notified and the campaign will get scheduled to Post to
//         creator's Instagram Page. <br />
//         <Button variant="outlined" color="primary" sx={{ marginTop: "20px" }}>
//           Scheduled Date: {currentScheduledDate}
//         </Button>
//       </DialogContent>
//     </>
//   );

//   const failedContent = (
//     <>
//       <DialogTitle>Error!</DialogTitle>
//       <DialogContent>
//         Not Enough Account Balance
//         <br />
//         Please Add Balance to Approve the Requests
//         <br />
//         <Button variant="outlined" color="primary" sx={{ marginTop: "20px" }}>
//           Add Funds
//         </Button>
//       </DialogContent>
//     </>
//   );

//   const handleAccept = () => {
//     axios
//       .post("http://localhost:8000/api/v1/brand/campaign-new-requests-accept", {
//         campaignId: currentCampaignId,
//         creatorId: currentCreatorId,
//         costPerPost: costPerPost,
//         brandId: user.brand_id,
//       })
//       .then((ress) => {
//         if (ress.data.success) {
//           handleOpenInfoDialog(successContent);
//         } else if (!ress.data.success) {
//           handleOpenInfoDialog(failedContent);
//         }
//       })
//       .catch((e) => {
//         // Handle error
//       });
//   };

//   const handleDecline = () => {
//     axios
//       .post(
//         "http://localhost:8000/api/v1/brand/campaign-new-requests-decline",
//         {
//           campaignId: currentCampaignId,
//           creatorId: currentCreatorId,
//           costPerPost: costPerPost,
//         }
//       )
//       .then((ress) => {
//         if (ress.data.success) {
//           fetchData();
//         } else if (!ress.data.success) {
//           handleOpenInfoDialog(failedContent);
//         }
//       })
//       .catch((e) => {
//         // Handle error
//       });
//   };

//   const createCampaign = async (e) => {
//     e.preventDefault();

//     // navigate("/campaign");
//     // window.location.reload(true);
//     window.open(`/campaign`, "_blank");
//   };

//   const columns = [
//     { field: "id", headerName: "S.No", width: 20 },
//     {
//       field: "avatar",
//       headerName: "",
//       renderCell: (params) => (
//         <img
//           src={params.value}
//           alt="Avatar"
//           style={{ width: 40, height: 40, borderRadius: "50%" }}
//         />
//       ),
//     },
//     { field: "creatorName", headerName: "Name", width: 80 },
//     { field: "category", headerName: "Category", width: 120 },
//     { field: "followers", headerName: "Followers", width: 80 },
//     {
//       field: "pricePerPost",
//       headerName: "Price Per Post",
//       width: 120,
//       renderCell: (params) => `Rs. ${params.value}`,
//     },
//     {
//       field: "profile",
//       headerName: "Instagram",
//       width: 140,
//       renderCell: (params) => (
//         <Button
//           endIcon={<ArrowRightIcon />}
//           onClick={() => window.open(params.value, "_blank")}
//           style={{
//             backgroundColor: "transparent",
//             border: "none",
//             color: "#C70039",
//             cursor: "pointer",
//             textDecoration: "none",
//             textTransform: "none",
//           }}
//         >
//           Instagram Profile
//         </Button>
//       ),
//     },
//     {
//       field: "insights",
//       headerName: "Insights",
//       width: 80,
//       renderCell: (params) => (
//         <span
//           onClick={() => showCreatorDetails(params.row.influencer_id)} // Pass the ID or necessary parameter
//           style={{ cursor: "pointer", color: "blue" }}
//         >
//           Insights
//         </span>
//       ),
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 100,
//       renderCell: (params) => (
//         <button
//           style={{
//             backgroundColor: "transparent",
//             border: "none",
//             color: "#F94C10",
//             cursor: "pointer",
//             textDecoration: "none",
//           }}
//         >
//           {params.value}
//         </button>
//       ),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 180,
//       renderCell: (params) => (
//         <div>
//           {params.row.status === "Requested" && (
//             <>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 size="small"
//                 sx={{ marginRight: "5px" }}
//                 onClick={() =>
//                   handleOpenDeclineDialog(
//                     params.row.influencer_id,
//                     campaignId,
//                     params.row.publishDate,
//                     params.row.pricePerPost
//                   )
//                 }
//               >
//                 Decline
//               </Button>
//               {/* <Button variant='outlined' color='success' size = 'small'  onClick={() => handleAccept(params.row.influencer_id, campaignId)}>Accept</Button> */}
//               <Button
//                 variant="outlined"
//                 color="success"
//                 size="small"
//                 onClick={() =>
//                   handleOpenDialog(
//                     params.row.influencer_id,
//                     campaignId,
//                     params.row.publishDate,
//                     params.row.pricePerPost
//                   )
//                 }
//               >
//                 Accept
//               </Button>
//             </>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const rows = campaignData;

//   return (
//     <>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           flexGrow: 1,
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             marginBottom: "10px",
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={createCampaign}
//             style={{
//               cursor: "pointer",
//               textDecoration: "none",
//               textTransform: "none",
//             }}
//             sx={{ marginRight: "10px" }}
//           >
//             Add Funds
//           </Button>
//           <Button
//             variant="outlined"
//             style={{
              
//               textDecoration: "none",
//               textTransform: "none",
//             }}
//           >
//             Balance: Rs. {balance}
//           </Button>
//         </div>

//         <div style={{ overflowY: "auto", flexGrow: 1 }}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             disableSelectionOnClick
//             getRowHeight={() => 80} // Set the desired row height
//             initialState={{}}
//             pageSizeOptions={[10, 20]}
//             // checkboxSelection
//           />
//         </div>

        
//       </div>

//       {/* </TableContainer> */}

//       {currentCampaignId && (
//         <ClickAwayListener onClickAway={handleClickAway}>
//           <Dialog
//             open={isDialogOpen}
//             onClose={handleCloseDialog}
//             disableEscapeKeyDown
//             keepMounted
//           >
//             <DialogTitle>Confirm Approval</DialogTitle>
//             <DialogContent>
//               Are you sure you want to Approve Influencer Request?
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   handleAccept();
//                   handleCloseDialog();
//                 }}
//                 color="success"
//               >
//                 YES
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </ClickAwayListener>
//       )}

//       <ClickAwayListener onClickAway={handleClickAway}>
//         <Dialog
//           open={infoDialogOpen}
//           onClose={handleCloseInfoDialog}
//           keepMounted
//           disableEscapeKeyDown
//         >
//           {infoDialogContent}
//           <DialogActions>
//             <Button
//               variant="contained"
//               onClick={handleCloseInfoDialog}
//               color="success"
//             >
//               OK
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </ClickAwayListener>

//       {currentCampaignId && (
//         <ClickAwayListener onClickAway={handleClickAway}>
//           <Dialog
//             open={isDeclineDialogOpen}
//             onClose={handleCloseDeclineDialog}
//             disableEscapeKeyDown
//             keepMounted
//           >
//             <DialogTitle>Decline Request</DialogTitle>
//             <DialogContent>
//               Are you sure you want to Decline this Request?
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDeclineDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   handleDecline();
//                   handleCloseDeclineDialog();
//                 }}
//                 color="success"
//               >
//                 YES
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </ClickAwayListener>
//       )}
//     </>
//   );
// }
