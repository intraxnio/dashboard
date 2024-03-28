import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Stack,
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  FormControl,
InputLabel,
Select,
MenuItem,
  Paper, AccordionDetails, DialogActions, DialogContent, Typography, Alert, AlertTitle, RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CircularProgress from '@mui/material/CircularProgress';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useTheme from '@mui/system/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';



// import dayjs from 'dayjs';
// import samplePost from '../../images/IMG_2533.jpg'


function CreateInvoice() {


  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payeeName, setPayeeName] = useState("");
  const [payeeMobile, setPayeeMobile] = useState("");
  const [payeeEmail, setPayeeEmail] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const user = useSelector((state) => state.brandUser);
  const [showAlert, setShowAlert] = useState(false);
  // const baseUrl = "http://localhost:8000/api";
  const [errorMessage, setErrorMessage] = useState("");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));





  const getBrandProducts = (async () => {

    try {
      axios.post("/api/brand/get-brand-products", { userId : user.brand_id}).then(catResult => {
  
        setProducts(catResult.data.data);
  
      }).catch(er => {
        // Handle error
      });
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
   
    getBrandProducts();
 
  }, []);

  useEffect(() => {
    // Calculate total amount whenever selectedProducts change
    const total = selectedProducts.reduce((acc, product) => {
      return acc + product.unit_price * product.quantity;
    }, 0);
    setTotalAmount(total);
  }, [selectedProducts]);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    const selectedProduct = products.find((product) => product._id === productId);
    setSelectedProducts([...selectedProducts, { ...selectedProduct, quantity: 1 }]);
  };

  const handleQuantityIncrement = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity += 1;
    setSelectedProducts(updatedProducts);
  };

  const handleQuantityDecrement = (index) => {
    const updatedProducts = [...selectedProducts];
    if (updatedProducts[index].quantity > 1) {
      updatedProducts[index].quantity -= 1;
      setSelectedProducts(updatedProducts);
    }
  };

  const getTotalPrice = (product) => {
    return product.unit_price * product.quantity;
  };


  const handleBackClick = () => {
    navigate(`/brand/invoices`);

  };


  const createInvoice = async (e) => {
    e.preventDefault();

    if(!payeeName || !payeeMobile || !selectedProducts){
        toast.warning("Enter All Details");
      }

      else {

      await axios.post("/api/brand/create-new-invoice",
        { brand_id : user.brand_id, payeeName: payeeName, payeeMobile : payeeMobile, payeeEmail : payeeEmail, totalAmount : totalAmount, selectedProducts : selectedProducts })
      .then((res) => {

            setLoading(true);

            if(!res.data.invoiceCreated){
                setLoading(false);
                toast.error("Error! Please try again.");

            }
            else if(res.data.invoiceCreated){
                
                setLoading(false);
                navigate(`/brand/invoices`);
                toast.success("Payment Link Sent");

                  }

      })
      .catch((err) => {
      
          toast.error("An error occurred. Please try again later.");
      });

    }

    
  };


  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={() => handleBackClick()}>Back</Button>

        <Grid container sx={{ paddingBottom : '60px'}}>

                <Grid item xs={12} sm={10} md={8}>
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      maxWidth={600}
                      margin="auto"
                      padding={1}
                    >

                      <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="text"
                        id="payeeName"
                        onChange={(e) => {
                          setPayeeName(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Payee Name"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Payee Name"
                      ></TextField>

                    <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="text"
                        id="payeeMobile"
                        onChange={(e) => {
                          setPayeeMobile(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Payee Mobile"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Payee Mobile"
                         inputProps={{ inputMode: 'numeric' }}
                      ></TextField>

                      <TextField
                        sx={{ background : '#FFFFFF', borderColor : '#FFFFFF'}}
                        type="email"
                        id="payeeEmail"
                        onChange={(e) => {
                          setPayeeEmail(e.target.value);
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Payee Email"
                        InputLabelProps={{
                          shrink: true, // Always show the label above the input
                        }}
                         placeholder="Invoice will be emailed"
                      ></TextField>

<FormControl variant="outlined" fullWidth>
          <InputLabel id="product-select-label">Select Product(s)</InputLabel>
          <Select
            labelId="product-select-label"
            id="product-select"
            value=""
            onChange={handleProductChange}
            label="Select Product"
          >
            {products.map((product) => (
              <MenuItem key={product._id} value={product._id}>
                {product.product_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedProducts.length > 0 && (
        <Grid item xs={12}>
          <TableContainer sx={{ overflow : 'auto'}} component={Paper}>
            {isSmallScreen ? (
               <Table >
               <TableHead>
                 <TableRow>
                   <TableCell sx={{ fontSize : '11px'}}>Product</TableCell>
                   <TableCell sx={{ fontSize : '11px'}}>Price (Rs.)</TableCell>
                   <TableCell sx={{ fontSize : '11px'}}>Quantity</TableCell>
                   {/* <TableCell sx={{ fontSize : '11px'}}>Total (Rs.)</TableCell> */}
                 </TableRow>
               </TableHead>
               <TableBody>
                 {selectedProducts.map((product, index) => (
                   <TableRow key={index}>
                     <TableCell sx={{ fontSize : '14px'}}>{product.product_name}</TableCell>
                     <TableCell sx={{ fontSize : '14px'}}>{product.unit_price}/{product.unit_type}</TableCell>
                     <TableCell>
                       <Button onClick={() => handleQuantityDecrement(index)}>-</Button>
                       {product.quantity}
                       <Button onClick={() => handleQuantityIncrement(index)}>+</Button>
                     </TableCell>
                     {/* <TableCell sx={{ fontSize : '14px'}}>{getTotalPrice(product)}</TableCell> */}
                   </TableRow>
                 ))}
 
                 <TableRow >
                   <TableCell colSpan={2} align="right">
                     Total Amount 
                   </TableCell>
                   <TableCell>Rs. {totalAmount}</TableCell>
                 </TableRow>
               </TableBody>
             </Table>

            ) : (
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>Rs. {product.unit_price}/{product.unit_type}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleQuantityDecrement(index)}>-</Button>
                      {product.quantity}
                      <Button onClick={() => handleQuantityIncrement(index)}>+</Button>
                    </TableCell>
                    <TableCell>Rs. {getTotalPrice(product)}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Total Amount
                  </TableCell>
                  <TableCell>Rs. {totalAmount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            )}
           
          </TableContainer>
        </Grid>
      )}


                    
                    <ToastContainer autoClose={3000}/>
                    

                      <Button
                        variant="contained"
                        label="Next"
                        size="large"
                        endIcon={<ArrowRightAltIcon />}
                        sx={{
                          marginTop: "30px",
                          maxWidth: "250px",
                        }}
                        onClick={()=> createInvoice()}
                      >
                        Create Invoice
                        {loading && (
                <CircularProgress
                  size={24}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: -12, // Center the CircularProgress
                    marginLeft: -12, // Center the CircularProgress
                  }}
                />
              )}
                      </Button>

                      {/* {loading && (
          <CircularProgress size={24} sx={{ marginLeft: '10px' }} /> // Include a material icon here
        )} */}
                    </Box>
                </Grid>

                <Grid item xs={4}>
              </Grid>

        </Grid>



{showAlert && (
  <Alert
    severity="error"
    style={{
      position: "fixed",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    }}
    onClose={()=>{setShowAlert(false)}}
  >
    <AlertTitle>Error</AlertTitle>
    {errorMessage}
  </Alert>
)}

    
    </>
  );

  
}

export default CreateInvoice;
