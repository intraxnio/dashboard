import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography, Stack, Button, ClickAwayListener, 
  Dialog,
  DialogContent,
  TextField,
  DialogActions, Select, MenuItem, FormControl, InputLabel, Accordion,
  AccordionSummary,
  AccordionDetails} from '@mui/material';
  import { Helmet } from 'react-helmet-async';



function RedirectLink() {
  const user = useSelector((state) => state.brandUser);
  const navigate = useNavigate();
  const { linkId } = useParams();
  const baseUrl = 'http://localhost:8001';
  const baseUrl2 = "http://localhost:8001/usersOn";
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [metaData, setMetaData] = useState({ title: '', description: '', image: '' });



  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/', {
          shortId: linkId,
        });

        console.log('Response::::', response.data.urlDetails);

  
        if (response.data) {
          const data = response.data;
          const urlDetails = response.data.urlDetails;
          setPdfFile(response.data);
  
          switch (data.linkType) {
            case 'pdf':
              // Check if the PDF is password-protected
              if (data.passwordProtected) {

                setIsPasswordProtected(true);
                setIsDialogOpen(true);


              } else {
                // PDF is not password-protected, display it directly
                const pdfViewerDiv = document.createElement('div');
                pdfViewerDiv.id = 'pdfViewer';
                
                // Append the div to the document body or any other container you prefer
                document.body.appendChild(pdfViewerDiv);
                
                // Fetch the PDF data and create an iframe to display it
                const pdfBlob = await fetch(response.data.pdfData).then((response) => response.blob());
                const pdfUrl = URL.createObjectURL(pdfBlob);
                
                const iframe = document.createElement('iframe');
                iframe.src = pdfUrl;
                iframe.style.width = '100%';
                iframe.style.height = '100vh';
                iframe.style.border = 'none';
                
                // Append the iframe to the pdfViewerDiv
                pdfViewerDiv.appendChild(iframe);
                

              }
              break;
  
            case 'url':

            if(urlDetails.hasSocialSharing){

              const title = urlDetails.socialTitle;
              const description = urlDetails.socialDescription;
              const image = urlDetails.socialImage;
    
              // Render link preview
              setMetaData({ title, description, image });
    
              // Redirect
              window.location.href = data.redirectUrl;
        

            }

            else if(!urlDetails.hasSocialSharing){
    
              // Redirect
              window.location.href = data.redirectUrl;
        

            }

                  
            break;

          
              
  
            default:
              console.error('Invalid linkType:', data.linkType);
              // Handle the case where linkType is neither 'pdf' nor 'url'
              navigate('/error');
          }
        } else {
          console.error('No HTML content found in the response');
          navigate('/error');
        }
      } catch (error) {
        console.error(error);
        navigate('/error');
      } finally {
        // setLoading(false);
      }
    };
  
    fetchData();
  }, [linkId, navigate]);



  

  const checkPdfPassword = async(e) =>{

    await axios.post("/api/usersOn/check-pdf-password",
    { shortId: linkId, password : password },
    {withCredentials: true}
  )
  .then(async (ress) => {
    
    if(ress.data.matching){

      handleCloseDialog();

     
      const pdfViewerDiv = document.createElement('div');
      pdfViewerDiv.id = 'pdfViewer';
      
      // Append the div to the document body or any other container you prefer
      document.body.appendChild(pdfViewerDiv);
      
      // Fetch the PDF data and create an iframe to display it
      const pdfBlob = await fetch(pdfFile.pdfData).then((response) => response.blob());
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      
      // Append the iframe to the pdfViewerDiv
      pdfViewerDiv.appendChild(iframe);

    }

    else {
      toast.error("Invalid Password");

    }
    })
    .catch((e) => {
      // Handle errors
    });
  }


  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkPdfPassword();
    }
  };

  // You can render a loading indicator or other content if needed
  return (
    <>
 <Helmet>
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:image" content={metaData.image} />
        {/* ... other meta tags ... */}
      </Helmet>


    {isPasswordProtected && (
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
                        type="password"
                        id="linkTitle"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        onKeyDown={handleEnterKeyPress} 
                        margin="normal"
                        variant="outlined"
                        label="Enter Password"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Enter Password"
                      ></TextField>

                    
                      </Box>
            </DialogContent>
            <DialogActions>
             
              <Button
                onClick={() => {
                    checkPdfPassword();
                }}
                color="success"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}

<ToastContainer autoClose={2000} />

    </>
  );
}

export default RedirectLink;
