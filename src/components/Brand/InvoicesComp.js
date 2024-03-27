import React, { useState, useEffect } from "react";
// import { format } from 'date-fns-tz';
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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

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
  const [invoicesData, setInvoicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  // const baseUrl = "http://localhost:8001/usersOn";
  // const baseUrl = "http://localhost:8000/api";

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

  const openPdfInvoice = (invoiceId) => {

    try {

      setLoading(true);

      axios.post("/api/brand/is-pdf-link-available", {
          invoiceId: invoiceId,
        })
        .then((ress) => {
        setLoading(false);
        console.log('Streammm::::', ress.data.filePdf);
    window.open(ress.data.filePdf, "_blank");

        })
        .catch((e) => {
          console.log('error:::', e);
          // Handle error
        });
  
  
      } catch (error) {
        console.error(error);
      }

    
    // Open the PDF URL in a new tab
    // window.open(pdfUrl, "_blank");
};

  const fetchData = async () => {
    try {

    //   axios.post("/api/usersOn/all-links", {
        axios.post("/api/brand/all-invoices", {
        userId: user.brand_id,
      })
      .then((ress) => {
      setInvoicesData(ress.data.data);
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

  const createCampaign = async (e) => {
    e.preventDefault();

      navigate("/brand/createInvoice");

  };

  

  const columns = [
    { 
      field: 'id', 
      headerName: 'S.No', 
      width: 60,
    },

    { 
      field: 'createdDate', 
      headerName: 'Created Date', 
      width: 160,
      renderCell: (params) => {
        const formattedDateTime = dayjs.utc(params.value).locale('en').format('DD-MM-YYYY');
    
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
      field: 'payeeName', 
      headerName: 'Payee', 
      width: 160,
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
      field: 'payeeMobile', 
      headerName: 'Mobile Number', 
      width: 160,
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
      field: "invoice",
      headerName: "Invoice",
      width: 100,
      renderCell: (params) => (
        <span
          onClick={() => openPdfInvoice(params.value)} // Pass the ID or necessary parameter
          style={{ cursor: "pointer", color: "blue" }}
        >
          Invoice
        </span>
      ),
    },

    { 
      field: 'invoiceAmount', 
      headerName: 'Amount', 
      width: 130,
      renderCell: (params) => (
        <div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            Rs. {params.value}
          </div>
        </div>
      ),
    },

    { 
      field: 'paymentStatus', 
      headerName: 'Payment Status', 
      width: 160,
      renderCell: (params) => (
        <div>
          <div style={{ whiteSpace: 'pre-wrap', color: params.value ? green[500] : deepOrange[500] }}>
            {params.value ? 'Success' : 'Pending'}
          </div>
        </div>
      ),
    },

   
  
  
  ];

  const rows = invoicesData;


  return (
<>

<ThemeProvider theme={theme}>

<div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>



  {isSmallScreen ? 
  (
    <Grid sx={{ paddingX : '6px', paddingBottom : '22px'}}>

  <Button
  startIcon = { < AddLinkIcon />}
  variant="outlined"
  color="primary"
  onClick={createCampaign}
  sx={{ marginTop: "14px", marginBottom : '16px', color: deepOrange[500], cursor: 'pointer', textDecoration: 'none', textTransform: 'none'}}
  >
  Create Invoice
  </Button>


    
  {loading ? (<CircularProgress />) : (<>
   
    {invoicesData.map((invoice) => (
  <Card sx={{ marginBottom : '16px'}}>
<CardContent sx={{ display : 'flex', flexDirection : 'row', justifyContent: 'space-between'}}>

<Stack sx={{ display: 'flex', flexDirection : 'column'}}>
  <Typography sx={{ fontSize : '16px', fontWeight : 500, marginBottom : '6px'}} >Date</Typography>
  <Typography >{dayjs.utc(invoice.createdDate).locale('en').format('DD-MM-YYYY')}</Typography>
  </Stack>

  <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
  <Typography sx={{ fontSize : '16px', fontWeight : 500, marginBottom : '6px'}} >Name</Typography>
  <Typography >{invoice.payeeName}</Typography>
  </Stack>

  <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
  <Typography sx={{ fontSize : '16px', fontWeight : 500, marginBottom : '6px'}} >Mobile</Typography>
  <Typography >{invoice.payeeMobile}</Typography>
  </Stack>

 

</CardContent>

<CardContent sx={{ display : 'flex', flexDirection : 'row', justifyContent: 'space-between'}}>

   <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
  <Typography sx={{ fontSize : '16px', fontWeight : 500, marginBottom : '6px'}}>Amount</Typography>
  <Typography >Rs. {invoice.invoiceAmount}</Typography>
  </Stack>

  <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
  <Typography sx={{ fontSize : '16px', fontWeight : 500, marginBottom : '6px'}}>Payment Status</Typography>
  <Typography sx={{ color: invoice.paymentStatus ? green[500] : deepOrange[500]}}>{invoice.paymentStatus ? 'Success' : 'Pending'}</Typography>
  </Stack>

  <Stack sx={{ display: 'flex', flexDirection : 'column'}}>
  <Typography sx={{ fontSize : '16px', fontWeight : 500, marginBottom : '6px'}}>Invoice</Typography>
  <Typography  sx={{ color: 'blue', cursor : 'pointer'}} onClick={() => openPdfInvoice(invoice.invoice)} >Invoice</Typography>
  </Stack>
 

</CardContent>
<CardActions>
 
</CardActions>
</Card> ))}
</>)}

</Grid>

) : (
<>

<Button
startIcon = { < AddLinkIcon />}
variant="outlined"
color="primary"
onClick={createCampaign}
sx={{ marginBottom: "14px", color: deepOrange[500],  cursor: 'pointer',
textDecoration: 'none',
textTransform: 'none' }}
>
Create Invoice
</Button>

<TableContainer sx={{ width : '90%'}}>


  {loading ? (<CircularProgress />) : (<>

{invoicesData !== null && invoicesData.length !== 0  ? ( 


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
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  }}
>
  <div > No Invoices</div>

</div> 

 )}

 </>)}


</TableContainer>
</>
  )}

  </div>

</ThemeProvider>


     




<ToastContainer autoClose= {2000}/>

    

    
    </>
  );
}
