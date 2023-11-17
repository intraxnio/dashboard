import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useSelector } from "react-redux";
import { Button, Typography, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import MoveDownRoundedIcon from '@mui/icons-material/MoveDownRounded';
import CircularProgress from '@mui/material/CircularProgress';


export default function CampaignNewRequests() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const user = useSelector((state) => state.brandUser);
  const campaignId = searchParams.get("campaignId");
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false);
  const [currentCampaignId, setCurrentCampaignId] = useState("");
  const [currentCreatorId, setCurrentCreatorId] = useState("");
  const [currentScheduledDate, setCurrentScheduledDate] = useState("");
  const [currentCampaignCaption, setCurrentCampaignCaption] = useState("");
  const [costPerPost, setCostPerPost] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";




  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(2) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2) + "K";
    } else {
      return number.toString();
    }
  }

  const handleOpenDialog = (
    creator_id,
    campaign_id,
    publishDate,
    pricePerPost
  ) => {
    const selectedCampaign = campaignData.find(
      (campaign) => campaign.campaign_id === campaign_id
    );
  
    if (selectedCampaign) {
      setCurrentCreatorId(creator_id);
      setCurrentCampaignId(campaign_id);
      setCurrentCampaignCaption(selectedCampaign.caption);
      setCurrentScheduledDate(publishDate);
      setCostPerPost(pricePerPost);
      setIsDialogOpen(true); // Open the dialog
    }
  };

  const schedulePost = (campaign_id, brandUser_id, publishedDate, costPerPost) => {
    
      axios.post(baseUrl+"/brand/campaign/publishNow", {
        influencer_id: currentCreatorId,
        campaign_id: campaign_id,
        media_id: "18022611298510911",
        brandUser_id: brandUser_id,
        publishDate: publishedDate,
        costPerPost: costPerPost
      })
      .then(() => {
        // setOpenDialog(false);
        // setConfirmationDialogOpen(false);

        console.log('Scheduledddd');
      })
      .catch((error) => {
        // Handle error if needed
      });
  };
  



  

  const handleOpenDeclineDialog = (
    creator_id,
    campaign_id,
    publishDate,
    pricePerPost
  ) => {
    setCurrentCreatorId(creator_id);
    setCurrentCampaignId(campaign_id);
    setCurrentScheduledDate(publishDate);
    setCostPerPost(pricePerPost);
    setIsDeclineDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  const handleCloseDeclineDialog = () => {
    setIsDeclineDialogOpen(false); // Close the dialog
  };

  const handleOpenInfoDialog = (content) => {
    setInfoDialogOpen(true);
    setInfoDialogContent(content);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    fetchData();
  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const fetchData = async () => {
    try {

      const res = await axios.post(baseUrl+"/brand/campaign-new-requests",
        {
          campaignId: campaignId,
        }
      );

      const fetchBalance = await axios.post(baseUrl+"/brand/get-account-balance",
        {
          brand_id: user.brand_id,
        }
      );

      setCampaignData(res.data.campaignData);
      setBalance(fetchBalance.data.balance);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showCreatorDetails = (creatorId) => {
    // Redirect to another page with campaignId and userId
    window.open(`/indiDetails?userId=${creatorId}`, "_blank");
  };

  const successContent = (
    <>
      <DialogTitle>Congratulations!</DialogTitle>
      <DialogContent>
        Creator request for Campaign Promotion has been Approved.
        <br />
        Creator will get notified and the campaign will get scheduled to Post to
        creator's Instagram Page. <br />
        <Button variant="outlined" color="primary" sx={{ marginTop: "20px" }}>
          Scheduled Date: {currentScheduledDate}
        </Button>
      </DialogContent>
    </>
  );

  const failedContent = (
    <>
      <DialogTitle>Oops!</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
        Not Enough Credits
          </Typography>
          <Typography gutterBottom>
          Please Buy Credits to Approve the Request.
          </Typography>
       
        <br />
        1 credit = Rs. 1/-
        <br />
        <Button variant="outlined" color="success" sx={{ marginTop: "20px", textDecoration: "none", textTransform: "none", }}>
          Buy Credits
        </Button>
      </DialogContent>
    </>
  );

  const handleAccept = () => {
    axios.post(baseUrl+"/brand/campaign-new-requests-accept", {
        campaignId: currentCampaignId,
        creatorId: currentCreatorId,
        caption: currentCampaignCaption,
        publishDate: currentScheduledDate,
        costPerPost: costPerPost,
        brandId: user.brand_id,
      })
      .then((ress) => {
        if (ress.data.success) {
          schedulePost(currentCampaignId, user.brand_id, currentScheduledDate, costPerPost);
          handleOpenInfoDialog(successContent);
        } else if (!ress.data.success) {
          handleOpenInfoDialog(failedContent);
        }
      })
      .catch((e) => {
        // Handle error
      });
  };

  const handleDecline = () => {
    axios.post(baseUrl+"/brand/campaign-new-requests-decline",
        {
          campaignId: currentCampaignId,
          creatorId: currentCreatorId,
          costPerPost: costPerPost,
        }
      )
      .then((ress) => {
        if (ress.data.success) {
          fetchData();
        } else if (!ress.data.success) {
          handleOpenInfoDialog(failedContent);
        }
      })
      .catch((e) => {
        // Handle error
      });
  };

  const createCampaign = async (e) => {
    e.preventDefault();

    // navigate("/campaign");
    // window.location.reload(true);
    window.open(`/campaign`, "_blank");
  };

  const columns = [
    { field: "id", headerName: "S.No", width: 20 },
    {
      field: "avatar",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Avatar"
          style={{ width: 46, height: 46, borderRadius: "20%" }}
        />
      ),
    },
    { field: "creatorName", headerName: "Name", width: 120 },
    { field: "category", headerName: "Category", width: 140 },
    { field: "followers", headerName: "Followers", width: 120 },
    {
      field: "insights",
      headerName: "Insights",
      width: 100,
      renderCell: (params) => (
        <span
          onClick={() => showCreatorDetails(params.row.influencer_id)} // Pass the ID or necessary parameter
          style={{ cursor: "pointer", color: "blue" }}
        >
          Insights
        </span>
      ),
    },
    {
      field: "profile",
      headerName: "Instagram",
      width: 120,
      renderCell: (params) => (
        <Button
          endIcon={<ArrowRightIcon />}
          onClick={() => window.open(params.value, "_blank")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#C70039",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "none",
          }}
        >
          Profile
        </Button>
      ),
    },
    {
      field: "pricePerPost",
      headerName: "Price Per Post",
      width: 140,
      renderCell: (params) => `Rs. ${params.value}`,
    },


    {
      field: "estAvgReach",
      headerName: "Est.Avg Reach",
      width: 140,
      renderCell: (params) => (
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#F94C10",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          {formatNumber(params.value)}
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <div>
          {params.row.status === "Requested" && (
            <>
              {/* <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ marginRight: "5px" }}
                onClick={() =>
                  handleOpenDeclineDialog(
                    params.row.influencer_id,
                    campaignId,
                    params.row.publishDate,
                    params.row.pricePerPost
                  )
                }
              >
                Decline
              </Button> */}
              {/* <Button variant='outlined' color='success' size = 'small'  onClick={() => handleAccept(params.row.influencer_id, campaignId)}>Accept</Button> */}
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() =>
                  handleOpenDialog(
                    params.row.influencer_id,
                    campaignId,
                    params.row.publishDate,
                    params.row.pricePerPost
                  )
                }
              >
                Accept
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const rows = campaignData;

  return (
    <>
    {loading ? (<CircularProgress />) : (<>
      {campaignData !== null && campaignData.length !== 0  ? (
         <div
         style={{
           display: "flex",
           flexDirection: "column",
           flexGrow: 1,
           overflow: "hidden",
         }}
       >
         <div
           style={{
             display: "flex",
             justifyContent: "flex-end",
             marginBottom: "10px",
           }}
         >
           <Button
             variant="outlined"
            //  onClick={createCampaign}
             style={{
               cursor: "pointer",
               textDecoration: "none",
               textTransform: "none",
             }}
             sx={{ marginRight: "10px" }}
           >
             Buy Credits
           </Button>
           <Tooltip title={`${balance} Credits = Rs. ${balance}`} arrow>
           <Button
             variant="outlined"
             style={{
               
               textDecoration: "none",
               textTransform: "none",
             }}
             sx={{ paddingX: "20px" }}

           >
             Credits: &nbsp;{balance}
           </Button>
           </Tooltip>
         </div>
 
         <div style={{ overflowY: "auto", flexGrow: 1 }}>
           <DataGrid
             rows={rows}
             columns={columns}
             sx={{
              "&:focus": {
                outline: "none", // Remove the red border on focus
              },
            }}
            isRowSelectable={(params) => {
              return false; // Disable selection for all rows
            }}
            onSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection.selectionModel);
            }}
            selectionModel={selectedRows}
             getRowHeight={() => 80} // Set the desired row height
             pageSizeOptions={[10, 20]}
             // checkboxSelection
           />
         </div>
 
         
       </div>
    ): (
      <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "50vh", // Adjust the height as needed
    }}
  >
    <MoveDownRoundedIcon style={{ fontSize: '60px', marginBottom: '20px', color: '#5D12D2'}}/>
    <div> No NEW Requests</div>
  </div>
    )}
    </>)}
   
   


     

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={infoDialogOpen}
          onClose={handleCloseInfoDialog}
          keepMounted
          disableEscapeKeyDown
        >
          {infoDialogContent}
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleCloseInfoDialog}
              color="success"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>


      {currentCampaignId && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogContent>
              Are you sure you want to Approve Influencer Request?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleAccept();
                  handleCloseDialog();
                }}
                color="success"
              >
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}

      {currentCampaignId && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDeclineDialogOpen}
            onClose={handleCloseDeclineDialog}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Decline Request</DialogTitle>
            <DialogContent>
              Are you sure you want to Decline this Request?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeclineDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDecline();
                  handleCloseDeclineDialog();
                }}
                color="success"
              >
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}


    </>
  );
}
