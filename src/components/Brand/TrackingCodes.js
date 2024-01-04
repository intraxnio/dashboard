import React, { useState, useEffect } from "react";
import { format } from 'date-fns-tz';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Button, TableContainer, Box, DialogActions, TextField, ClickAwayListener, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { deepOrange, green, purple, blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileCopyIcon from '@mui/icons-material/ContentCopy';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useTheme } from '@mui/material/styles';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CodeIcon from '@mui/icons-material/Code';



const CopyIcon = ({ onClick }) => (
  <FileCopyIcon style={{ cursor: 'pointer', marginLeft: '8px', color: '#362FD9' }} onClick={onClick} />
);




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





export default function TrackingCodes() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.brandUser);
  const [linkData, setLinkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const baseUrl = "http://localhost:8001/usersOn";
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddCodeDialogOpen, setIsAddCodeDialogOpen] = useState(false);
  const [newCodeTitle, setNewCodeTitle] = useState('');
  const [newScript, setNewScript] = useState('');
  const [deletableTrackingId, setDeletableTrackingId] = useState('');
  const [selectedTrackingDetails, setSelectedTrackingDetails] = useState(null);
  const [newTrackingCodeName, setNewTrackingCodeName] = useState('');
  const [newCodeScript, setNewCodeScript] = useState('');





  const handleEditClick = async (trackingId) => {
    try {
      const response = await axios.post(baseUrl + "/get-tracking-code-details", {
        trackingCodeId: trackingId,
      });

      const trackingDetails = response.data.data; 

      // Set the selected tracking ID details in state
      setSelectedTrackingDetails(trackingDetails);
      setNewCodeTitle(trackingDetails.tracking_code_name);
      setNewScript(trackingDetails.tracking_script);

      // Open the dialog
      handleOpenDialog();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };




  const deleteTrackingCode = async () => {

    axios.post(baseUrl + "/delete-tracking-code", {
      trackingCodeId: deletableTrackingId,
    
    })
    .then((ress) => {
      if (ress.data.updated) {
          toast.success("Tracking Code Delete");
          fetchData();
      } else if (!ress.data.success) {
          toast.success("Delete failed");
      }
    })
    .catch((e) => {
      // Handle error
    });
};

const addTrackingCode = () => {

  axios.post(baseUrl + "/add-tracking-code", {
    userId: user.user_id,
    tracking_code_name: newTrackingCodeName,
    newCodeScript : newCodeScript
  })
  .then((ress) => {
    if (ress.data.added) {
        toast.success("New Tracking Code Added");
        fetchData();
    } else if (!ress.data.success) {
        toast.success("Please try again");
    }
  })
  .catch((e) => {
    // Handle error
  });
};

const openDeleteDialogPrompt = async (trackingId) => {

  setDeletableTrackingId(trackingId);
  handleOpenDeleteDialog();
};



  const fetchData = async () => {
    try {

      axios.post(baseUrl + "/tracking-codes", {
        userId: user.user_id,
      })
      .then((ress) => {
      setLinkData(ress.data.data);
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

    if(!user.user_id){
      navigate("/login/brand");

    }

    else if(user.user_id){
      fetchData();

    }
  }, []);

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false); // Close the dialog
  };

  const handleCloseAddCodeDialog = () => {
    setIsAddCodeDialogOpen(false); // Close the dialog
  };

  const handleOpenDialog = () => {

    setIsDialogOpen(true); // Open the dialog

};

const handleOpenDeleteDialog = () => {

  setIsDeleteDialogOpen(true); // Open the dialog

};

const updateLinkDetails = (trackingId) => {

    axios.post(baseUrl + "/update-tracking-code", {
      trackingCodeId: trackingId,
      tracking_code_title: newCodeTitle,
      tracking_code_script: newScript,
    })
    .then((ress) => {
      if (ress.data.updated) {
          toast.success("Tracking Code Updated");
          fetchData();
      } else if (!ress.data.success) {
          toast.success("Update failed");
      }
    })
    .catch((e) => {
      // Handle error
    });
};

  

  const columns = [
    { 
      field: 'id', 
      headerName: 'S.No', 
      width: 80,
    },
  
    { 
      field: 'tracking_code_name', 
      headerName: 'Tracking Code Name', 
      width: 260,
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
      field: 'tracking_script',
      headerName: 'Tracking Script',
      width: 320,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
        field: 'tracking_id',
        headerName: 'Edit',
        width: 80,
        renderCell: (params) => (
          <ModeEditIcon
            style={{ cursor: 'pointer' }}
            onClick={() => handleEditClick(params.value)}
          />
        ),
      },

    {
        field: 'tracking_id_delete',
        headerName: 'Delete',
        width: 160,
        renderCell: (params) => (
          <DeleteOutlineOutlinedIcon
            style={{ cursor: 'pointer' }}
            onClick={() => openDeleteDialogPrompt(params.value)}
          />
        ),
      },


   
  
  
  ];

  const rows = linkData;


  return (
<>

    <ThemeProvider theme={theme}>

    <Button
    startIcon = { < CodeIcon />}
    variant="outlined"
    color="primary"
    onClick={()=> setIsAddCodeDialogOpen(true)}
    sx={{ marginBottom: "14px", color: deepOrange[500], marginLeft : '26px' }}
    style={{
      cursor: 'pointer',
      textDecoration: 'none',
      textTransform: 'none'
    }} 
    >
    New Script +
    </Button>

    <TableContainer sx={{ paddingX : '26px'}}>


      {loading ? (<CircularProgress />) : (<>

    {linkData !== null && linkData.length !== 0  ? (

      <DataGrid 
        rows={rows}
        columns={columns}
        sx={{
          "&:focus": {
            outline: "none", // Remove the red border on focus
          },
          paddingX : '10px'
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

     {/* update tracking code  */}
    {linkData && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogContent>
            <Box
                      display="flex"
                      flexDirection={"column"}
                      margin="auto"
                      padding={1}
                      sx={{ width: '100%'}}
                    >

                    <TextField
                        type="text"
                        id="codeTitle"
                        value={newCodeTitle}
                        onChange={(e) => {
                          setNewCodeTitle(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Tracking Code Title"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Code Title"
                      ></TextField>


                        <TextField
                        type="text"
                        id="scriptId"
                        value={newScript}
                        multiline
                        rows={9}
                        onChange={(e) => {
                            setNewScript(e.target.value);
                          }}
                        margin="normal"
                        variant="outlined"
                        label="Script"
                        InputLabelProps={{
                         shrink: true, // Always show the label above the input
                       }}
                       placeholder="<script> </script>"
                      

                      ></TextField>

                      </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                    updateLinkDetails(selectedTrackingDetails._id);
                  handleCloseDialog();
                }}
                color="success"
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}


      {/* Delete tracking code  */}

      {linkData && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDeleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            disableEscapeKeyDown
            keepMounted
            fullWidth
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent> Are you sure want to delete ? </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteTrackingCode();
                  handleCloseDeleteDialog();
                }}
                color="success"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}

      {/* Add tracking code  */}

      {linkData && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isAddCodeDialogOpen}
            onClose={handleCloseAddCodeDialog}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogContent>
            <Box
                      display="flex"
                      flexDirection={"column"}
                      margin="auto"
                      padding={1}
                      sx={{ width: '450px'}}
                    >

                        <TextField
                        type="text"
                        id="addNewCode"
                        onChange={(e) => {
                            setNewTrackingCodeName(e.target.value);
                          }}
                        margin="normal"
                        variant="outlined"
                        label="Tracking Code Name"
                        InputLabelProps={{
                         shrink: true, // Always show the label above the input
                       }}
                       placeholder= "ex: Facebook Marketing Script"
                    

                      ></TextField>

                        <TextField
                        type="text"
                        id="codeScript"
                        multiline
                        rows={9}
                        onChange={(e) => {
                            setNewCodeScript(e.target.value);
                          }}
                        margin="normal"
                        variant="outlined"
                        label="Script"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder="<script> </script>"
                       
                    

                      ></TextField>



                      </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsAddCodeDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                    addTrackingCode();
                    handleCloseAddCodeDialog();
                }}
                color="success"
              >
                Update Link
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}




<ToastContainer autoClose= {2000}/>

    

    
    </>
  );
}
