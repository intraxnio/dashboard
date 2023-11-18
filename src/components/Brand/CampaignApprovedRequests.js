import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useSelector } from "react-redux";
import { Button, TableContainer} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import MoveDownRoundedIcon from '@mui/icons-material/MoveDownRounded';







export default function CampaignApprovedRequests() {

const location = useLocation();
const navigate = useNavigate();
const searchParams = new URLSearchParams(location.search);
const user = useSelector(state => state.brandUser);
const campaignId = searchParams.get("campaignId");
const [userId, setUserId] = useState("");
const [campaignData, setCampaignData] = useState([]);
const [selectedRows, setSelectedRows] = useState([]);
const [loading, setLoading] = useState(true);
// const baseUrl = "http://localhost:8000/api";
const baseUrl = "https://13.234.41.129:8000/api";





useEffect(() => {
      axios.post("/api/brand/campaign-approved-requests", {
      campaignId: campaignId
    }).then(ress=>{

        setCampaignData(ress.data.campaignData);
        setUserId(user.brand_id);
        setLoading(false);


    }).catch(e=>{

    })
  }, []);

const showCreatorDetails = (creatorId) => {
  // Redirect to another page with campaignId and userId
  window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
};

const handleAccept = (creatorId) => {
  // Redirect to another page with campaignId and userId
  window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
};const handleDecline = (creatorId) => {
  // Redirect to another page with campaignId and userId
  window.open(`/creator/indiDetails?userId=${creatorId}`, '_blank');
};

const createCampaign = async (e) => {
    e.preventDefault();

      // navigate("/campaign");
      // window.location.reload(true);
  window.open(`/campaign`, '_blank');

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
    { field: "followers", headerName: "Followers", width: 100 },
    {
      field: "pricePerPost",
      headerName: "Price Per Post",
      width: 120,
      renderCell: (params) => `Rs. ${params.value}`,
    },
    {
      field: "profile",
      headerName: "Instagram",
      width: 100,
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
      field: "insights",
      headerName: "Insights",
      width: 80,
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
      field: "status",
      headerName: "Status",
      width: 100,
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
          {params.value}
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <div>
          {params.row.status === "Approved" && (
            <>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ marginRight: "5px" }}
                // onClick={() =>
                //   handleOpenDeclineDialog(
                //     params.row.influencer_id,
                //     campaignId,
                //     params.row.publishDate,
                //     params.row.pricePerPost
                //   )
                // }
              >
                Stop Post
              </Button>
              {/* <Button variant='outlined' color='success' size = 'small'  onClick={() => handleAccept(params.row.influencer_id, campaignId)}>Accept</Button> */}
              {/* <Button
                variant="outlined"
                color="success"
                size="small"
                // onClick={() =>
                //   handleOpenDialog(
                //     params.row.influencer_id,
                //     campaignId,
                //     params.row.publishDate,
                //     params.row.pricePerPost
                //   )
                // }
              >
                Accept
              </Button> */}
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
    <TableContainer sx={{ marginTop: '35px', display: 'flex', flexDirection: 'column',paddingLeft: '10px', paddingRight: '10px'  }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>

    </div>
  
    <div style={{ height: '100%', width: '100%' }}>
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
  </TableContainer> ): ( 
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
    <div> No Approved Requests</div>
  </div>) }
  </>)}
  </>
  );
}
