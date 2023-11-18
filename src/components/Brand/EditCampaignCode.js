
async function handleEditCampaign(e) {

    // e.preventDefault();
    getCampaignName(campaignData.campaign_name);
    getCaption(campaignData.caption);
    setSelectedDate(campaignData.publishDate);

    setEditMode(true);
  }


async function cancelEdit(e){
    e.preventDefault();
    setEditMode(false);
  }

  async function updateCampaign(e) {

    e.preventDefault();
      await axios.post("/api/brand/update-campaign", {
      campaignName: campaignName,
      caption: caption,
      // publishDate: selectedDate,
      // fileType: fileType,
      campaignId: campaignId,
      
    }).then(res=>{
      // toast.success("Login Success!");
      // navigate("/brand/dashboard");
      setShowSuccessDialog(true);

        // Close the dialog after 3 seconds
        setTimeout(() => {
          setShowSuccessDialog(false);
          window.location.reload();
        }, 3000);
      // window.location.reload();

    }).catch(e=>{

    })
  
  }


{editMode ? (
    <>
      <Grid container spacing="2">
          <Grid item xs={8}>
            <form action="#" method="post">
              <Box
                display="flex"
                flexDirection={"column"}
                maxWidth={450}
                margin="auto"
                marginTop={10}
                padding={1}
              >
                <TextField
                  type="text"
                  id="campaignName"
                  multiline
                  value={campaignName}
                  onChange={(e) => {
                    getCampaignName(e.target.value);
                  }}
                  margin="normal"
                  variant="outlined"
                  label="Campaign Name"
                ></TextField>

                <TextField
                  type="text"
                  label="Caption"
                  multiline
                  value={caption}
                  variant="outlined"
                  id="caption"
                  onChange={(e) => {
                    getCaption(e.target.value);
                  }}
                  sx={{ marginTop: "25px" }}
                ></TextField>
                <Stack spacing={4} sx={{ width: "250px", marginTop: "25px" }}>
                </Stack>
               
                <Button display='flex' variant="contained" color="success" size='large' onClick={updateCampaign}
                endIcon={<ArrowRightAltIcon />}
           sx={{
               // maxWidth: '300px',
               marginTop: '30px',
               textTransform:'capitalize',
               marginBottom: '12px'
   
               
           }}>
            Save
           </Button>


           <Button key='11' variant="outlined" color="primary" size='large' onClick={cancelEdit}
           sx={{
               // maxWidth: '300px',
              //  marginLeft: '30px',
               textTransform:'capitalize',
               marginBottom: '12px'
               
           }}>
            Cancel
           </Button>
           <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Campaign Updated Successfully
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>

              </Box>
            </form>
          </Grid>
        </Grid>
      </>

    ):(
      <>
      </>
      )}




       {/* This pushes the buttons to the bottom */}
      {/* {campaignData.is_completed ? (null) : (
        <Button variant="outlined" color="success" size='large' onClick={handleEditCampaign}
          sx={{
            textTransform: 'capitalize',
            marginTop: '12px'
          }}>
          Edit Campaign
        </Button>
      )} */}


      {/* <Button key='11' size='medium'
        onClick={campaignData.is_completed ? () => onShowStats(campaignId) : () => onShowRequests(campaignId)}
        sx={{
          marginLeft: '30px',
          textTransform: 'capitalize',
          marginTop: '12px'
        }}> */}

        {/* {campaignData.is_completed ? 'Show Metrics' : 
        
        ( 
          <Tooltip
          title='Click to see Received Requests'
          placement='top'
        >
        <AvatarGroup total={requests}>
  <Avatar alt="Remy Sharp" src={sideImage} />
  <Avatar alt="Travis Howard" src={sideImage2} />
</AvatarGroup>
        </Tooltip>
        ) 
        } */}
      {/* </Button> */}



