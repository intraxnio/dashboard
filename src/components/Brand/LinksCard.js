import React, { useState, useEffect } from "react";
import { format } from 'date-fns-tz';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Button, TableContainer, Card, CardContent, Typography, CardActions, Stack, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import Chip from '@mui/material/Chip';
import { deepOrange, green, purple, blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileCopyIcon from '@mui/icons-material/ContentCopy';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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





export default function LinksCard() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.brandUser);
  const [linkData, setLinkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  // const baseUrl = "http://localhost:8001/usersOn";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));




  const truncateText = (linkTitle) => {

    if(linkTitle.length > 15){
      return linkTitle.substring(0, 15) + '...'
    }

    else
    return linkTitle;
  }
  
  const handleCopyClick = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };


  const fetchData = async () => {
    try {

      axios.post("/api/usersOn/all-links", {
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
      navigate("/");

    }

    else if(user.user_id){
      fetchData();

    }
  }, []);

  const onShowMetrics = (linkId) => {
    // navigate(`/brand/campaigns/${campaignId}/details`);
    navigate(`/brand/link/metrics?linkId=${linkId}`);
  };

  const createCampaign = async (e) => {
    e.preventDefault();

    //   axios.post(baseUrl + "/brand/check-brand-plan-details", {
    //   userId: user.brand_id
    // }).then(ress=>{

      // if(ress.data.onPlan && !ress.data.campaignTried ){
      navigate("/brand/createLink");

      // }
      // else if(!ress.data.onPlan && !ress.data.campaignTried) {
      //   navigate("/brand/campaign");


      // }
      // else {
      //   navigate("/brand/planDetails");


      // }

    // }).catch(e=>{

    // })

  };

  

  const columns = [
    { 
      field: 'id', 
      headerName: 'S.No', 
      width: 60,
    },
  
    { 
      field: 'linkTitle', 
      headerName: 'Link Title', 
      width: 210,
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
      field: 'shortUrl',
      headerName: 'Short Url',
      width: 210,
      renderCell: (params) => (
        <Grid container sx={{ display: 'flex', justifyContent : 'space-between'}}>
          <Grid item style={{ whiteSpace: 'pre-wrap' }}>
            {params.value.length > 45
              ? params.value.substr(0, 45) + '...'
              : params.value}
          </Grid>
          <Grid item>
          <CopyIcon onClick={() => handleCopyClick(params.value)} />

          </Grid>
        </Grid>
      ),
    },

    { 
      field: 'totalClicks', 
      headerName: 'Clicks', 
      width: 140,
      renderCell: (params) => (
          <Grid container style={{ whiteSpace: 'pre-wrap', alignItems : 'center', justifyContent : 'flex-start', paddingLeft : '16px' }}>
            {params.value}
          </Grid>
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
      field: 'linkId',
      headerName: 'Full Details',
      width: 160,
      renderCell: (params) => {
    
        return (
         
            <Button variant="outlined" color="success" onClick={() => onShowMetrics(params.value)}>
              View Results
            </Button>
         
        );
      },
    },


   
  
  
  ];

  const rows = linkData;


  return (
<>

    <ThemeProvider theme={theme}>
    

      {isSmallScreen ? (
        <>

      <Button
      startIcon = { < AddLinkIcon />}
      variant="outlined"
      color="primary"
      onClick={createCampaign}
      sx={{ marginTop: "14px", color: deepOrange[500]}}
      style={{
        cursor: 'pointer',
        textDecoration: 'none',
        textTransform: 'none'
      }} 
      >
      Create ShortUrl
      </Button>

    
        
        {linkData.map((link) => (
      <Card sx={{ marginTop : '12px'}}>
    <CardContent sx={{ display : 'flex', flexDirection : 'row', justifyContent: 'space-between'}}>

      <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
      <Typography sx={{ fontSize : '18px', fontWeight : 500, marginBottom : '6px'}} >Link Title</Typography>
      <Typography >{truncateText(link.linkTitle)}</Typography>
      </Stack>

      <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
      <Typography sx={{ fontSize : '18px', fontWeight : 500, marginBottom : '6px'}} >Short Url</Typography>
      <Stack sx={{ display: 'flex', flexDirection : 'row'}}>
      <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', maxWidth: '100%' }}>
            <Typography >
                {link.shortUrl}
            </Typography>
            </a>
          <CopyIcon onClick={() => handleCopyClick(link.shortUrl)} />

      </Stack>
      </Stack>

      {/* <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
      <Typography sx={{ fontSize : '18px', fontWeight : 500, marginBottom : '6px'}} >Created Date</Typography>
      <Typography >{format(new Date(link.createdDate), 'dd-MM-yyyy', { timeZone: 'Asia/Kolkata' })}</Typography>
      </Stack> */}

     

    </CardContent>

    <CardContent sx={{ display : 'flex', flexDirection : 'row', justifyContent: 'space-between'}}>

       <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
      <Typography sx={{ fontSize : '18px', fontWeight : 500, marginBottom : '6px'}}>Clicks</Typography>
      <Typography >{link.totalClicks}</Typography>
      </Stack>

      <Stack sx={{ display: 'flex', flexDirection : 'column', marginTop : '6px'}}>
      <Button onClick={() => onShowMetrics(link.linkId)} variant="outlined" color="success">
        View Analytics
      </Button>     
      </Stack>

     

    </CardContent>
    <CardActions>
     
    </CardActions>
  </Card> ))}
  </>
  
  ) : (
    <>

    <Button
    startIcon = { < AddLinkIcon />}
    variant="outlined"
    color="primary"
    onClick={createCampaign}
    sx={{ marginBottom: "14px", color: deepOrange[500], marginLeft : '26px' }}
    style={{
      cursor: 'pointer',
      textDecoration: 'none',
      textTransform: 'none'
    }} 
    >
    Create ShortUrl
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
    </>
      )}
    </ThemeProvider>

     




<ToastContainer autoClose= {2000}/>

    

    
    </>
  );
}
