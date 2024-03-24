import React, { useState, useEffect } from "react";
import { Typography, TextField, ClickAwayListener, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button,Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddLinkIcon from '@mui/icons-material/AddLink';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange, green, purple, blue } from '@mui/material/colors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";





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


function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  // const baseUrl = "http://localhost:8000/api";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [unitType, setUnitType] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);



  const user = useSelector((state) => state.brandUser);

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    setCurrentProductId(productId); // Set the current product ID to be deleted
    // Open confirmation dialog or perform deletion directly, based on your needs
    setIsDeleteDialogOpen(true); // Open dialog for confirmation
  };

  const deleteProduct = () => {

    try{

      axios.post("/api/brand/delete-product", {
        product_id: currentProductId,
      })
      .then((ress) => {
        if (ress.data.deleted) {

          setIsDeleteDialogOpen(false);
          toast.success("Product Deleted");
          getBrandProducts();


        } else if (!ress.data.deleted) {
          setIsDeleteDialogOpen(false);
          toast.warning("Deletion Failed");
          
         
        }
      })
      .catch((e) => {
        // Handle error
      });

    }

    catch{

    }

   
  };



  useEffect(() => {
    getBrandProducts();
  }, []);

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


  const handleUnitTypeChange = (event) => {
    setUnitType(event.target.value);
  };

  const addNewProduct = async (e) => {
    e.preventDefault();

    if(!productName || !unitPrice || !unitType){
        toast.warning("Enter All Details");
      }

      else {


      await axios.post("/api/brand/add-new-product",
        { brand_id : user.brand_id, productName: productName, unitPrice : unitPrice, unitType : unitType })
      .then((res) => {

            setLoading(true);

            if(!res.data.productAdded){
                setLoading(false);
                toast.error("Error! Please try again.");

            }
            else if(res.data.productAdded){
                
                setLoading(false);
                setIsDialogOpen(false);
                toast.success("Product Added");
                getBrandProducts();

               
                  }

      })
      .catch((err) => {
      
          toast.error("An error occurred. Please try again later.");
      });

    }

    
  };


  return (

    <ThemeProvider theme={theme}>
    

<Button
      startIcon = { < AddLinkIcon />}
      variant="outlined"
      color="primary"
      onClick={()=> setIsDialogOpen(true)}
      sx={{ marginTop: "14px", color: deepOrange[500]}}
      style={{
        cursor: 'pointer',
        textDecoration: 'none',
        textTransform: 'none'
      }} 
      >
      New Product
      </Button>

    <Grid container spacing={2} marginTop={2}>
      <Grid item xs={10}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>Rs. {product.unit_price}</TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => handleDeleteProduct(product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>

    {products && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
               Enter Product Details
              </Typography>
             
              <TextField
                type="text"
                id="productName"
                onChange={(e) => {
                    setProductName(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Product Name"
                value={productName}
              ></TextField>

              <TextField
                type="text"
                id="unitPrice"
                onChange={(e) => {
                    setUnitPrice(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Unit Price"
                value={unitPrice}
              ></TextField>

            <Select
                value={unitType}
                onChange={handleUnitTypeChange}
                variant="outlined"
                label="Unit Type"
              >
                <MenuItem value="Kg">Kg</MenuItem>
                <MenuItem value="Gms">Gms</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>


        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" 
              onClick={addNewProduct}
              >
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}

{currentProductId && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDeleteDialogOpen}
            onClose={handleDeleteDialogClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Are you sure want to delete product ?</DialogTitle>

          
            <DialogActions>
              <Button onClick={()=> setIsDeleteDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" 
              onClick={deleteProduct}
              >
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}

</ThemeProvider>
  );
}

export default ProductList;
