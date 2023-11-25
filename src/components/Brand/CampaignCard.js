import React, { useState, useEffect } from "react";
import { format } from 'date-fns-tz';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Button, TableContainer,  Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent, Typography, Link} from "@mui/material";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import Chip from '@mui/material/Chip';
import { deepOrange, green, purple, blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const termsDetails = (
  <>
  <Typography sx={{fontSize : '16px', fontWeight : 500}}>
  Certain goods, services or brands may not be promoted with branded content. 
  We prohibit promotion of the following: <br /> <br />
  </Typography>
  1. Illegal products or services <br /><br />
  2. Tobacco products, vaporisers, electronic cigarettes or any other products that simulate smoking <br /><br />
  3. Drugs and drug-related products, including illegal or recreational drugs <br /><br />
  4. Unsafe products and supplements.
     Unsafe supplements include but are not limited to anabolic steroids, chitosan, comfrey, dehydroepiandrosterone, ephedra and human growth hormones. <br /><br />
  5. Weapons, ammunition or explosives.
     Branded content must not promote firearms (including firearms parts, ammunition, paintball guns and BB guns), firearm silencers or suppressors, weapons (including pepper spray, non-culinary knives/blades/spears, 
     tasers, nunchucks, batons or weapons intended for self-defence), or fireworks or explosives. <br /><br />
  6. Adult products or services, except for family planning and contraception.
     Branded content must not promote the sale or use of adult products or services, except for posts for family planning and contraception. <br /><br />
  7. Payday loans, payslip advances and bail bonds. <br /><br />
  8. Multilevel marketing. <br /><br />
  9. Initial coin offerings, binary options or contract for difference trading. <br /><br />
  10. Controversial political or social issues or crises in an exploitative manner for commercial purposes. <br /><br />
  11. Regional lotteries. <br /><br />
  12. Negative portrayal of voting or census participation in the India and/or advising users not to vote or participate in a census. <br /><br />
  13. Violations of Facebook or Instagram <Link href='https://transparency.fb.com/en-gb/policies/community-standards/?source=https%3A%2F%2Fwww.facebook.com%2Fcommunitystandards%2F' target='_blank' underline='none' sx={{color: '#362FD9'}}>Community Standards</Link> or 
  <Link href='https://help.instagram.com/477434105621119' target='_blank' underline='none' sx={{color: '#362FD9'}}> Community Guidelines</Link> <br /><br />
  Do you agree to our policies and guidelines ?
 </>
)



const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: green[500],
    },
    warning: {
      main: purple[500],
    },
    info: {
      main: blue[500],
    },
  },
});





export default function CampaignCard() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.brandUser);
  const [campaignData, setCampaignData] = useState([]);
  const [currentCampaignId, setCurrentCampaignId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [scroll, setScroll] = useState('paper');
  



  const fetchData = async () => {
    try {

      axios.post("/api/brand/all-campaigns", {
        userId: user.brand_id,
      })
      .then((ress) => {
      setCampaignData(ress.data.data);
      setLoading(false);
      })
      .catch((e) => {
        // Handle error
      });


    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {

    if(!user.brand_id){
      navigate("/");

    }

    else if(user.brand_id){
      fetchData();

    }
  }, []);


  

  const handleMenuOpen = (event, campaignId) => {
    setAnchorEl(event.currentTarget);
    setCurrentCampaignId(campaignId);
  };

  const handleMenuOpen2 = (event, campaignId) => {
    setAnchorEl2(event.currentTarget);
    setCurrentCampaignId(campaignId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClose2 = () => {
    setAnchorEl2(null);
  };

  const handleMarkAsCompleted = () => {

    handleMenuClose();
    setIsDialogOpen(true); // Open the dialog
  

  };

  const handleDeleteCampaign = () => {

    try{

      axios.post("/api/brand/check-campaign-deletable", {
        campaignId: currentCampaignId,
      })
      .then((ress) => {
        if (ress.data.isDeletable) {

          setIsDeletable(true);

        } else if (!ress.data.isDeletable) {
          setIsDeletable(false);
          
         
        }
      })
      .catch((e) => {
        // Handle error
      });

    }

    catch{

    }

    handleMenuClose();
    setIsDeleteDialogOpen(true);
    // Perform "Delete" action here
   
  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleMarkAccept = () => {
    axios.post("/api/brand/campaign-mark-completed", {
        campaignId: currentCampaignId,
      })
      .then((ress) => {
        if (ress.data.success) {
          toast.success("Campaign marked as Completed");
          fetchData();
          setIsDialogOpen(false);

        } else if (!ress.data.success) {
          toast.warning("Please try again later");
         
        }
      })
      .catch((e) => {
        // Handle error
      });
  };

  const handleDeleteAccept = () => {
    axios.post("/api/brand/campaign-delete", {
        campaignId: currentCampaignId,
      })
      .then((ress) => {
        if (ress.data.deleted) {
          toast.success("Campaign Deleted Successfully");
          fetchData();
          setIsDeleteDialogOpen(false);

        } else if (!ress.data.deleted) {
          toast.warning("Please try again later");
         
        }
      })
      .catch((e) => {
        // Handle error
      });
  };




  const createCampaign = async (e) => {
    e.preventDefault();

      axios.post("/api/brand/check-brand-plan-details", {
      userId: user.brand_id
    }).then(ress=>{

      if(ress.data.onPlan && !ress.data.campaignTried ){
      navigate("/brand/campaign");

      }
      else if(!ress.data.onPlan && !ress.data.campaignTried) {
        navigate("/brand/campaign");


      }
      else {
        navigate("/brand/planDetails");


      }

    }).catch(e=>{

    })

  };

  const onShowDetails = (campaignId) => {
    // navigate(`/brand/campaigns/${campaignId}/details`);
    navigate(`/brand/campaign/requests?campaignId=${campaignId}`);
  };

  const onShowMetrics = (campaignId) => {
    // navigate(`/brand/campaigns/${campaignId}/details`);
    navigate(`/brand/campaign/metrics?campaignId=${campaignId}`);
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'warning';
      case 'On-Going':
        return 'secondary';
      case 'In-Review':
        return 'primary'; // You can choose an appropriate color for 'In-Review'
      default:
        return 'default';
    }
  };
  

const columns = [
  // { field: 'id', headerName: 'S.No', width: 50 },
  { 
    field: 'id', 
    headerName: 'S.No', 
    width: 50,
  },

  {
    field: 'avatar',
    headerName: '',
    renderCell: (params) => {
      const isImage = params.row.fileType === 'image';
  
      return (
        <div style={{ width: 60, height: 150, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isImage ? (
             <img src={params.value} alt="Media" style={{ maxWidth: '100%', maxHeight: '100%' }} />
           
          ) : (
            <PlayCircleOutlineIcon />
           
          )}
        </div>
      );
    },
  },

  { 
    field: 'name', 
    headerName: 'Campaign', 
    width: 230,
    renderCell: (params) => (
      <div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {params.value.length > 45
            ? params.value.substr(0, 45) + '...'
            : params.value}
        </div>
      </div>
    ),
  },
  { 
    field: 'createdDate', 
    headerName: 'Created Date', 
    width: 150,
    renderCell: (params) => {
      const date = new Date(params.value);
      const formattedDateTime = format(date, 'dd-MM-yyyy', { timeZone: 'Asia/Kolkata' });
  
      return (
        <div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {formattedDateTime}
          </div>
        </div>
      );
    },
  },

  { 
    field: 'publishDate', 
    headerName: 'Publish Date', 
    width: 220,
    renderCell: (params) => {
      const date = new Date(params.value);
      const formattedDateTime = format(date, 'dd-MM-yyyy hh:mm:ss a', { timeZone: 'Asia/Kolkata' });
  
      return (
        <div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {formattedDateTime}
          </div>
        </div>
      );
    },
  },

  // { 
  //   field: 'status', 
  //   headerName: 'Status', 
  //   width: 130,
  //   renderCell: (params) => (
  //     <Chip
  //     size='small'
  //     label = {params.value ? 'Completed' : 'On - Going'}
  //     variant="outlined"
  //     color={params.value ? "warning" : "secondary"}
  //   />
  //   ),
  // },

  { 
    field: 'status', 
    headerName: 'Status', 
    width: 130,
    renderCell: (params) => (
      <Chip
        size='small'
        label={params.value}
        variant="outlined"
        color={getStatusColor(params.value)}
      />
    ),
  },
  

  {
    field: 'campaignId',
    headerName: 'Campaign Details',
    width: 160,
    renderCell: (params) => {
      const isCompleted = params.row.is_completed; // Assuming 'is_completed' is a field in your campaignData
  
      return (
        isCompleted ? (
          <Button variant="outlined" color="warning" onClick={() => onShowMetrics(params.value)}>
            View Results
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={() => onShowDetails(params.value)}>
          View Details
        </Button>
        )
      );
    },
  },

  {
    width: 40,
    renderCell: (params) => {
      const isCompleted = params.row.is_completed;
  
      return (

        isCompleted ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-expanded={anchorEl2 ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleMenuOpen2(event, params.row.campaignId)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl2}
            open={anchorEl2 !== null}
            onClose={handleMenuClose2}
          >
              <MenuItem onClick={() => onShowMetrics(params.row.campaignId)}>View Results</MenuItem>
            </Menu>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-expanded={anchorEl ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleMenuOpen(event, params.row.campaignId)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl !== null}
            onClose={handleMenuClose}
          >
             <MenuItem onClick={handleMarkAsCompleted}>Mark as Completed</MenuItem>
              <MenuItem onClick={handleDeleteCampaign}>Delete</MenuItem>
            </Menu>
          </div>
        )
        
      
        );
      },
    },
 


];

const rows = campaignData;




  return (
<>


{/* {showDetails ? (
        <BrandShowCampaignDetails campaignId={currentCampaignId} />
      ) :

   
    ( */}
    <ThemeProvider theme={theme}>
    <TableContainer >
    <Button
        variant="outlined"
        color="primary"
        onClick={()=> setIsTermsDialogOpen(true)}
        sx={{ marginBottom: "16px", color: deepOrange[500] }}
        style={{
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }} 
      >
        + New Campaign
      </Button>


    {loading ? (<CircularProgress />) : (<>
    {campaignData !== null && campaignData.length !== 0  ? (

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
      />
    ) : ( 
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <iframe
        width="900"
        height="500"
        src='https://app.supademo.com/demo/xSanFv0U8ZKrRcAeKH7i_'
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        target="_blank"
      ></iframe>

    </div>
  
     )}
    </>) }



    </TableContainer>
    </ThemeProvider>

    {currentCampaignId && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleMenuClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              Are you sure you want to mark this campaign as 'Completed'?
            </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleMarkAccept();
                }}
                color="success"
              >
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}


{isDeletable ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDeleteDialogOpen}
            onClose={handleMenuClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              Are you sure you want to DELETE this campaign?
            </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsDeleteDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDeleteAccept();
                }}
                color="success"
              >
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      ): ( 
      
      <ClickAwayListener onClickAway={handleClickAway}>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleMenuClose}
        disableEscapeKeyDown
        keepMounted
      >
        <DialogTitle>Sorry!</DialogTitle>
        <DialogContent>
          Cannot delete this campaign. One or more creators already shown interest. If don't want to continue the campaign,
          please select option 'Mark as Completed' instead.
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setIsDeleteDialogOpen(false)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>
  )}


  {/* terms dialogue  */}

 
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isTermsDialogOpen}
            onClose={()=> setIsTermsDialogOpen(false)}
            disableEscapeKeyDown
            keepMounted
            scroll={scroll}
          >
            <DialogTitle>Prohibited content</DialogTitle>
            <DialogContent>
           {termsDetails}
            </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsTermsDialogOpen(false)} color="primary">
                DISAGREE
              </Button>
              <Button
                onClick={createCampaign}
                color="success"
              >
                AGREE
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
     




<ToastContainer autoClose= {3000}/>

    

    
    </>
  );
}
