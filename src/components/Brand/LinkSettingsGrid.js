import React, { useState, useEffect, useRef} from 'react'
import axios from 'axios';
import { Box, Typography, Stack, Button, ClickAwayListener, 
    Dialog,
    DialogContent,
    TextField,
    DialogActions, Select, MenuItem, FormControl, InputLabel, Accordion,
    AccordionSummary, Switch, Grid, RadioGroup, FormControlLabel, Radio,
    AccordionDetails} from '@mui/material';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import FileCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useTheme from '@mui/system/useTheme';




const CopyIcon = ({ onClick }) => (
  <FileCopyIcon style={{ cursor: 'pointer', marginLeft: '8px', color: 'white' }} onClick={onClick} />
);



function LinkSettingsGrid({ shortId }) {

  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState('');
  const user = useSelector((state) => state.brandUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCodeDialogOpen, setIsAddCodeDialogOpen] = useState(false);
  const [newRedirect, setNewRedirect] = useState('');
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newTrackingCodeName, setNewTrackingCodeName] = useState('');
  const [newCodeScript, setNewCodeScript] = useState('');
  const [allTrackingCodes, setAllTrackingCodes] = useState([ ]);
  const httpsText = 'https://';
  const [selectedButton, setSelectedButton] = useState('socialSharing');
  const [selectedTrackingId, setSelectedTrackingId] = useState('');
  const [selectedTrackingOption, setSelectedTrackingOption] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState("false");
  const [socialTitle, setSocialTitle] = useState("");
  const [socialDescription, setSocialDescription] = useState("");
  const [socialImageFile, setSocialImageFile] = useState(null);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  // const baseUrl = "http://localhost:8001/usersOn";
  const containerRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event) => {
    if (touchStartX !== null) {
      const touchMoveX = event.touches[0].clientX;
      const deltaX = touchMoveX - touchStartX;
      if (containerRef.current) {
        containerRef.current.scrollLeft -= deltaX;
      }
      setTouchStartX(touchMoveX);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };





  const handleFileProtected = (e) => {
    setIsPasswordProtected(e.target.value);
  };
 
  const handleTrackingChange = (event) => {
    const selectedCode = allTrackingCodes.find((code) => code.value === event.target.value);

    setSelectedTrackingId(selectedCode?.id || ''); // Use optional chaining for safety
    setSelectedTrackingOption(event.target.value); // Update the selected option
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  const handleRedirectUrl = (e) => {
    const value = e.target.value;
  
    setNewRedirect((prevUserInput) => {
      if (!value) {
        return ''; // Set the state to an empty string if the value is empty
      } else if (value.startsWith('https://')) {
        return value;
      } else {
        return 'https://' + value;
      }
    });
  };
  

  const getTrackingCodes = (async () => {

      await axios.post("/api/usersOn/get-user-tracking-codes", { userId: user.user_id }).then((catResult) => {

        // Transform the tracking codes to the desired object structure
        const formattedTrackingCodes = catResult.data.data.map((code) => ({
          id: code._id, // Save the _id for database updates
          value: code.tracking_code_name, // Display trackingCodeName to the user
        }));
      
        setAllTrackingCodes(formattedTrackingCodes);
      }).catch((er) => {
        // Handle error
      });
  });

  const fetchData = async () => {
    setLoading(true);
    try {

      axios.post("/api/usersOn/get-link-details", {
        shortId : shortId
      }).then(ress=>{

        if(ress.data.data.linkType === 'url' && ress.data.trackingCode && ress.data.data.hasSocialSharing){

          setLinkData(ress.data.data);
          setNewRedirect(ress.data.data.redirectUrl);
          setNewLinkTitle(ress.data.data.linkTitle);
          setSelectedTrackingOption(ress.data.data.tracking_code_id.tracking_code_name);
          setSelectedTrackingId(ress.data.data.tracking_code_id._id);
          setSocialTitle(ress.data.data.socialTitle);
          setSocialDescription(ress.data.data.socialDescription);
          setSocialImageFile(ress.data.data.socialImage);
          setImagePreview(ress.data.data.socialImage);
          setUtmSource(ress.data.data.utm_source);
          setUtmMedium(ress.data.data.utm_medium);
          setUtmCampaign(ress.data.data.utm_campaign);
          getTrackingCodes();
          setLoading(false);

        }


        else if(ress.data.data.linkType === 'url' && !ress.data.trackingCode && ress.data.data.hasSocialSharing){

          setLinkData(ress.data.data);
          setNewRedirect(ress.data.data.redirectUrl);
          setNewLinkTitle(ress.data.data.linkTitle);
          setSocialTitle(ress.data.data.socialTitle);
          setSocialDescription(ress.data.data.socialDescription);
          setSocialImageFile(ress.data.data.socialImage);
          setImagePreview(ress.data.data.socialImage);
          setUtmSource(ress.data.data.utm_source);
          setUtmMedium(ress.data.data.utm_medium);
          setUtmCampaign(ress.data.data.utm_campaign);
          getTrackingCodes();
          setLoading(false);

        }

        else if(ress.data.data.linkType === 'url' && ress.data.trackingCode && !ress.data.data.hasSocialSharing){

          setLinkData(ress.data.data);
          setNewRedirect(ress.data.data.redirectUrl);
          setNewLinkTitle(ress.data.data.linkTitle);
          setSelectedTrackingOption(ress.data.data.tracking_code_id.tracking_code_name);
          setSelectedTrackingId(ress.data.data.tracking_code_id._id);
          setUtmSource(ress.data.data.utm_source);
          setUtmMedium(ress.data.data.utm_medium);
          setUtmCampaign(ress.data.data.utm_campaign);
          getTrackingCodes();
          setLoading(false);

        }

        else if(ress.data.data.linkType === 'url' && !ress.data.trackingCode && !ress.data.data.hasSocialSharing){

          setLinkData(ress.data.data);
          setNewRedirect(ress.data.data.redirectUrl);
          setNewLinkTitle(ress.data.data.linkTitle);
          setUtmSource(ress.data.data.utm_source);
          setUtmMedium(ress.data.data.utm_medium);
          setUtmCampaign(ress.data.data.utm_campaign);
          getTrackingCodes();
          setLoading(false);

        }


        else if( ress.data.data.linkType === 'pdf'){

          setLinkData(ress.data.data);
          setNewLinkTitle(ress.data.data.linkTitle);
          setPassword(ress.data.data.password);
          if(ress.data.data.passwordProtected){
          setIsPasswordProtected('true');

          }
          setLoading(false);

        }
  
      

  
      }).catch(e=>{
  
      })
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   

    fetchData();
  }, [shortId]);


  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  const handleCodeCloseDialog = () => {
    setIsAddCodeDialogOpen(false); // Close the dialog
  };

  const handleOpenDialog = () => {

    setIsDialogOpen(true); // Open the dialog

};

const handleCodeOpenDialog = () => {

    setIsAddCodeDialogOpen(true); // Open the dialog

};

const updateLinkDetails = () => {

  if( !newLinkTitle || newLinkTitle.trim() === ''){
    setLoading(false);
    toast.warning("Link Title is mandatory");
  }

  else if (!newRedirect || newRedirect.trim() === '') {
    setLoading(false);
    toast.warning("Destination URL is required");
  }

  else {

    if(selectedTrackingId){

      const FormData = require("form-data");
    const formData = new FormData();
    formData.append("shortId", shortId);
    formData.append("newRedirectUrl", newRedirect);
    formData.append("newLinkTitle", newLinkTitle);
    formData.append("trackingCodeId", selectedTrackingId);
    formData.append("socialTitle", socialTitle);
    formData.append("socialDescription", socialDescription);
    formData.append("socialImage", socialImageFile);
    formData.append("utmSource", utmSource);
    formData.append("utmMedium", utmMedium);
    formData.append("utmCampaign", utmCampaign);



    axios.post("/api/usersOn/update-link-details-trackingId-social", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((ress) => {
      if (ress.data.updated) {

          handleCloseDialog();
          fetchData();
          toast.success("Link Details Updated");
      } else if (!ress.data.success) {
          toast.success("Update failed");
      }
    })
    .catch((e) => {
      // Handle error
    });

    }

    else if((!selectedTrackingId || selectedTrackingId.trim() === '')){

    const FormData = require("form-data");
    const formData = new FormData();
    formData.append("shortId", shortId);
    formData.append("newRedirectUrl", newRedirect);
    formData.append("newLinkTitle", newLinkTitle);
    formData.append("socialTitle", socialTitle);
    formData.append("socialDescription", socialDescription);
    formData.append("socialImage", socialImageFile);
    formData.append("utmSource", utmSource);
    formData.append("utmMedium", utmMedium);
    formData.append("utmCampaign", utmCampaign);


    axios.post("/api/usersOn/update-link-details-with-social", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((ress) => {
      if (ress.data.updated) {

          handleCloseDialog();
          fetchData();
          toast.success("Link Details Updated");
      } else if (!ress.data.success) {
          toast.success("Update failed");
      }
    })
    .catch((e) => {
      // Handle error
    });

    }

  }

  
};


const updatePdfLinkDetails = () => {

  if( !newLinkTitle || newLinkTitle.trim() === '' ){
    setLoading(false);
    toast.warning("Link Title is mandatory");
  }

 else if( isPasswordProtected === 'true' && ( !password || password.trim() === '') ){
    setLoading(false);
    toast.warning("Password is required");
  }

  else {

    
  axios.post("/api/usersOn/update-pdflink-details", {
    shortId: shortId,
    passwordProtected: isPasswordProtected,
    password : password,
    newLinkTitle : newLinkTitle
  })
  .then((ress) => {
    if (ress.data.updated) {
      handleCloseDialog();
        toast.success("Link Details Updated");
    } else if (!ress.data.success) {
        toast.success("Update failed");
    }
  })
  .catch((e) => {
    // Handle error
  });

  }


};




const addTrackingCode = () => {

    axios.post("/api/usersOn/add-tracking-code", {
      userId: user.user_id,
      tracking_code_name: newTrackingCodeName,
      newCodeScript : newCodeScript
    })
    .then((ress) => {
      if (ress.data.added) {
          toast.success("New Tracking Code Added");
          getTrackingCodes();
      } else if (!ress.data.success) {
          toast.success("Please try again");
      }
    })
    .catch((e) => {
      // Handle error
    });
};

  const handleCopyClick = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleButtonClick = (button) => {
    // Handle button click and update the selectedButton state
    setSelectedButton(button);
  };

  const handleUploadButtonClick = () => {
    // Trigger the file input when the button is clicked
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
  
    // Check if a file is selected
    if (selectedFile) {
      // Read the contents of the selected image file
      const reader = new FileReader();
  
      reader.onloadend = () => {
        // Set the image preview
        setImagePreview(reader.result);
      };
  
      reader.readAsDataURL(selectedFile);
  
      // Set the selected image file
      setSocialImageFile(selectedFile);
    }
  };


  const renderAdditionalFields = () => {
    // Render additional fields based on the selected button
    switch (selectedButton) {
     
      case 'socialSharing':
        return (
          <>

          <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="text"
                        id="socialTitle"
                        value={socialTitle}
                        onChange={(e) => {
                          setSocialTitle(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Social Title"
                        fullWidth
                       
                      ></TextField>


                      <TextField
                      sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                      type="text"
                      id="socialDescription"
                      value={socialDescription}
                      onChange={(e) => {
                        setSocialDescription(e.target.value);
                      }}
                      margin="normal"
                      variant="outlined"
                      label="Social Description"
                      fullWidth
                      multiline
                     
                    ></TextField>

                <Grid container alignItems="center" marginTop={2}>


                        <input
                type="file"
                name="socialImage"
                accept=".jpg, .jpeg"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />

              {/* Custom-styled button */}
              <Button variant="contained" color="primary" onClick={handleUploadButtonClick}>
                Update Image
              </Button>

                  {imagePreview && (
                          <div style={{ marginTop: '10px', marginLeft : '10px' }}>
                            <img
                              src={imagePreview}
                              alt="Selected Image"
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                          </div>
                        )}

                    </Grid>

                    </>
        );

        case 'utmTags':
        return (
          <>

          <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF', marginTop : '26px'}}
                        type="text"
                        id="utm_source"
                        value={utmSource}
                        onChange={(e) => {
                          setUtmSource(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="UTM Source"
                        fullWidth
                       
                      ></TextField>


                      <TextField
                      sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                      type="text"
                      id="utm_medium"
                      value={utmMedium}
                      onChange={(e) => {
                        setUtmMedium(e.target.value);
                      }}
                      margin="normal"
                      variant="outlined"
                      label="UTM Medium"
                      fullWidth
                      multiline
                     
                    ></TextField>

                      <TextField
                      sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                      type="text"
                      id="utm_campaign"
                      value={utmCampaign}
                      onChange={(e) => {
                        setUtmCampaign(e.target.value);
                      }}
                      margin="normal"
                      variant="outlined"
                      label="UTM Campaign"
                      fullWidth
                      multiline
                     
                    ></TextField>


                    </>
        );


      case 'trackingCodes':
        return (

            <Stack sx={{ display: 'flex', flexDirection : 'row'}}>

            <FormControl fullWidth>
            {selectedTrackingOption ? null :  <InputLabel  sx={{ marginTop: '16px' }} id="code-name" >Click to select tracking codes</InputLabel>}
            <Select
            id="tracking-codes"
            value={selectedTrackingOption}
            onChange={handleTrackingChange}
            sx={{ marginTop : '16px'}}
             >

              {allTrackingCodes.length === 0 ? (
                  <Typography>No codes</Typography>
                ) : (
                  allTrackingCodes.map((code) => (
                    <MenuItem key={code.id} value={code.value}>
                      {code.value}
                    </MenuItem>
                  ))
                )}

            </Select>
            </FormControl>

            <Button onClick= {handleCodeOpenDialog} variant='outlined' success size='small' sx={{ marginTop : '16px', marginLeft: '6px'}}>Add</Button>
            </Stack>


        );
      default:
        return null;
    }
  };


  return (
   <>
     <Box sx={{
        backgroundColor: '#0E21A0',
        color: 'white',
        height: '100%',
        width: '100%',
        padding: '10px',
        borderRadius:'10px',
    }}
    > 

        <div style={{ display: 'flex' }}>
        {loading ? (
          <CircularProgress size={25} color="warning" />
        ) : 
        (

          linkData.linkType === 'url' ? (
            
            <Stack sx={{ display : 'flex', flexDirection :'column', width: '100%'}}>

            <Box border={1} 
            sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom : '12px', 
            borderWidth : '1px', 
            borderColor : 'white',
            borderRadius: '5px',
            width: '100%',
            paddingX: '10px',
            paddingY: '5px' }} >

            <Typography sx={{ fontSize: '18px'}}>Short Url</Typography>
            <Stack sx={{ display: 'flex', flexDirection : 'row'}}>
            <a href={linkData.redirectUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', maxWidth: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: 'white' }}>
                {'lynk.is/' + linkData.shortId}
            </Typography>
            </a>
            <CopyIcon onClick={() => handleCopyClick('lynk.is/'+ linkData.shortId)} />
            </Stack>
       
            </Box>



            <Stack border={1} 
             sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginBottom : '12px', 
                borderWidth : '1px', 
                borderColor : 'white',
                borderRadius: '5px',
                width: '100%',
                paddingX: '10px',
                paddingY: '5px' }} >
            <Typography sx={{ fontSize: '18px'}}>Destination Url</Typography>

            
            { linkData.redirectUrl && ( <Stack sx={{ display: 'flex', flexDirection : 'row'}}>
            <a href={linkData.redirectUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', maxWidth: '100%' }}>
            <Typography sx={{ fontSize: '14px', color: 'white', wordBreak: 'break-all' }}>
            {linkData.redirectUrl.length > 45
            ? linkData.redirectUrl.substring(0, 45) + '...'
            : linkData.redirectUrl}
            </Typography>
            </a>
            <CopyIcon onClick={() => handleCopyClick(linkData.redirectUrl)} />
            </Stack> )}
       


            </Stack>

            <Button variant='outlined' border={1} sx={{ justifyContent : 'center',  borderWidth : '1px', 
                borderColor : 'white', color: 'white', alignSelf: 'flex-end',
                borderRadius: '25px', maxWidth : '50%'}} onClick={handleOpenDialog}> Link Settings</Button>
            </Stack>
           ) : (

            
            <Stack sx={{ display : 'flex', flexDirection :'column', width: '100%'}}>

            <Box border={1} 
            sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom : '12px', 
            borderWidth : '1px', 
            borderColor : 'white',
            borderRadius: '5px',
            width: '100%',
            paddingX: '10px',
            paddingY: '5px' }} >

            <Typography sx={{ fontSize: '18px'}}>Short Url</Typography>
            <Stack sx={{ display: 'flex', flexDirection : 'row'}}>
            <a href={linkData.pdfFile} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', maxWidth: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: 'white' }}>
                {'lynk.is/' + linkData.shortId}
            </Typography>
            </a>
            <CopyIcon onClick={() => handleCopyClick('lynk.is/'+ linkData.shortId)} />
            </Stack>
       
            </Box>



            <Stack border={1} 
             sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginBottom : '12px', 
                borderWidth : '1px', 
                borderColor : 'white',
                borderRadius: '5px',
                width: '100%',
                paddingX: '10px',
                paddingY: '5px' }} >
            <Typography sx={{ fontSize: '18px'}}>PDF Url</Typography>

            
            { linkData.pdfFile && ( 
            <Stack sx={{ display: 'flex', flexDirection : 'row'}}>
            <a href={linkData.pdfFile} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', maxWidth: '100%' }}>
            <Typography sx={{ fontSize: '16px', color: 'white', wordBreak: 'break-all' }}>
            Click to see pdf
            </Typography>
            </a>
            <CopyIcon onClick={() => handleCopyClick(linkData.pdfFile)} />
            </Stack> )}
       


            </Stack>

            <Button variant='outlined' border={1} sx={{ justifyContent : 'center',  borderWidth : '1px', 
                borderColor : 'white', color: 'white', alignSelf: 'flex-end',
                borderRadius: '25px', maxWidth : '50%'}} onClick={handleOpenDialog}> Link Settings</Button>
            </Stack>
           )
        )}
      </div>

    </Box>

<ToastContainer autoClose= {2000}/>


{linkData.linkType === 'url' ?
(
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
                        id="linkTitle"
                        value={newLinkTitle}
                        onChange={(e) => {
                          setNewLinkTitle(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Link Title"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Link Title"
                      ></TextField>


                      <TextField
                        type="text"
                        id="linkTo"
                        // value={newRedirect.replace(/^https:\/\//, '')}
                        value={newRedirect.split('?')[0].replace(/^https:\/\//, '')}
                        onChange={handleRedirectUrl}
                        margin="normal"
                        variant="outlined"
                        label="Destination URL"
                        InputLabelProps={{
                         shrink: true, // Always show the label above the input
                       }}
                       InputProps={{
                        startAdornment: (
                          <span style={{ color: '#A9A9A9' }}>{httpsText}</span>
                        ),
                      }}

                      ></TextField>



                      <Accordion sx={{ marginTop: '16px', border: '1px solid #ddd'}} elevation={0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="advanced-content"
                id="advanced-header"
              >
                <Typography sx={{ color: '#67729D' }}>
                  Advanced (optional)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>

              <div
      ref={containerRef}
      style={{
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        maxWidth: '100%', // Set a maximum width for the container
        overflow: 'hidden',

      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: theme.spacing(1),
        }}
      >
        <Button
          variant={selectedButton === 'socialSharing' ? 'contained' : 'outlined'}
          size="medium"
          sx={{
            flex: '1', // Allow the button to grow
            overflow: 'auto',
            textOverflow: 'ellipsis',
           minWidth : { xs : 150 }
          }}
          onClick={() => handleButtonClick('socialSharing')}
        >
          Social Sharing
        </Button>

        <Button
          variant={selectedButton === 'utmTags' ? 'contained' : 'outlined'}
          size="small"
          sx={{
            flex: '1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth : { xs : 100 }
          }}
          onClick={() => handleButtonClick('utmTags')}
        >
          UTM Tags
        </Button>

        <Button
          variant={selectedButton === 'trackingCodes' ? 'contained' : 'outlined'}
          size="medium"
          sx={{
            flex: '1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth : { xs : 160 }
          }}
          onClick={() => handleButtonClick('trackingCodes')}
        >
          Tracking Codes
        </Button>
      </Stack>
    </div>

    {renderAdditionalFields()}
  </AccordionDetails>
            </Accordion>
                      </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                    updateLinkDetails();
                }}
                color="success"
              >
                Update Link
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )
    
    : (

            <ClickAwayListener onClickAway={handleClickAway}>
            <Dialog
              open={isDialogOpen}
              onClose={handleCloseDialog}
              disableEscapeKeyDown
              keepMounted
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
                          id="linkTitle"
                          value={newLinkTitle}
                          onChange={(e) => {
                            setNewLinkTitle(e.target.value);
                          }}
                          margin="normal"
                          variant="outlined"
                          label="Link Title"
                          InputLabelProps={{
                            shrink: true, // Always show the label above the input
                          }}
                          placeholder="Link Title"
                        ></TextField>

                        <Grid container alignItems="center" marginTop={2}>

            <Typography sx={{ fontSize : '16px', marginRight : '8px'}}> File: </Typography>

            <a href={linkData.pdfFile} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', maxWidth: '100%' }}>
            <Typography sx={{ fontSize: '16px', wordBreak: 'break-all' }}>
            Click to see pdf
            </Typography>
            </a>

             </Grid>

                        { isPasswordProtected ? (
                          <>
                          <Grid container alignItems="center" marginTop={2}>
                              <Grid item>
                                <Typography variant="body1" marginRight={10}>Password Protected </Typography>
                              </Grid>
                              <Grid item>
                                <RadioGroup
                                  row
                                  name="link-type-group"
                                  aria-label="link-type-group"
                                  value={isPasswordProtected}
                                  onChange={handleFileProtected}
                                >
                                  <FormControlLabel control={<Radio />} label="Yes" value="true" />
                                  <FormControlLabel control={<Radio />} label="No" value="false" />
                                </RadioGroup>

                              </Grid>
                            </Grid>


                                  {isPasswordProtected === 'true' && (
                                        <Grid container alignItems="center">
                                          <TextField
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            value={password}
                                            onChange={(e) => {
                                              setPassword(e.target.value);
                                            }}
                                            margin="normal"
                                            variant="outlined"
                                            label="Password"
                                            InputLabelProps={{
                                              shrink: true, // Always show the label above the input
                                            }}
                                            placeholder="Enter Password"
                                          />

                                          <Switch
                                            checked={showPassword}
                                            onChange={handleTogglePassword}
                                            inputProps={{ 'aria-label': 'Toggle password visibility' }}
                                          />
                                        </Grid>
                                      )}
                          </>
                         ) : ( null)}

                      

                             

                     
                        </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updatePdfLinkDetails();
                  }}
                  color="success"
                >
                  Update Link
                </Button>
              </DialogActions>
            </Dialog>
          </ClickAwayListener>
    )}



      {/* add tracking code dialog  */}

      {linkData && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isAddCodeDialogOpen}
            onClose={handleCodeCloseDialog}
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
                        label="<script> </script>"
                       
                    

                      ></TextField>



                      </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCodeCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                    addTrackingCode();
                  handleCodeCloseDialog();
                }}
                color="success"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}

   </>
  )
}

export default LinkSettingsGrid