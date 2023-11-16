import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography, Grid, TextField, Dialog, Select, MenuItem, DialogActions, DialogTitle, Box} from '@mui/material';
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useDispatch } from "react-redux";
import { logout } from "../../store/brandSlice";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';








export default function BankDetails() {

  const user = useSelector(state => state.creatorUser);
  const [bankDetails, setBankDetails] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('ICICI BANK');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = "http://localhost:8000/api";






const fetchBankDetails = useCallback(async () => {
  try {
    axios.post(baseUrl + "/creator/bank-details", {
      userId: user.creator_id,
    }).then(ress => {

      setBankDetails(ress.data.data);
      setLoading(false);
    }).catch(e => {
      // Handle error
    });
  } catch (error) {
    console.error(error);
  }
}, [user.creator_id]);

useEffect(() => {


  if(!user.creator_id){

    navigate("/login/creator");

  }
  else if(user.creator_id){
    fetchBankDetails();

  }


}, [fetchBankDetails]);




  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };


  const handleBackClick = () => {
    navigate(`/creator/profile`);

  };


  const saveBankDetails = async (e) => {
    e.preventDefault();

    setIsLoading(true);


    if(!accountNumber || !ifsc){
        setIsLoading(false);
        toast.warning("Enter Valid Details");
      }


      else {


      await axios.post(baseUrl+"/creator/submit-bankDetails",
        { userId: user.creator_id,
            bankName : bankName,
            accountNumber : accountNumber,
            ifsc : ifsc },
        {withCredentials: true}
      )
      .then((res) => {


            if(!res.data.data){

                setIsLoading(false);
                toast.error("Technical Error. Please try again");

            }
            else if(res.data.data){
                
                setIsLoading(false);
                toast.success("Success");

                setTimeout(() => {
                fetchBankDetails();

                    
                }, 1000);
                
            }

      })
      .catch((err) => {


        // if (err.response && err.response.data.error === "Wrong current password") {
        //   toast.warning("Wrong current password");
        // } 

        // else if (err.response && err.response.data.error === "email, password mismatch") {
        //   toast.warning("Invalid email or password");
        // } 
        
        // else {
          toast.error("Technical Error. Please try again later.");
        // }
      });

    }

    
  };



  return (
    <>

   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>


    {loading ? (<CircularProgress />) : (
    <>
    <Grid item xs={12} sm={6} md={6}>

        {Object.keys(bankDetails).length === 0 ? (

    <Box 
    display='flex' 
    flexDirection={'column'} 
    // maxWidth={450} 
    margin='auto'
    marginTop={5}
    padding={1}
    >
         <Select
      labelId="category-label"
      id="category-select"
      value={bankName}
      onChange={(e)=>{setBankName(e.target.value)}} >
      <MenuItem value="ICICI BANK">ICICI BANK</MenuItem>
      <MenuItem value="HDFC BANK">HDFC BANK</MenuItem>
      <MenuItem value="ANDHRA BANK">ANDHRA BANK</MenuItem>
      <MenuItem value="YES BANK">YES BANK</MenuItem>
      <MenuItem value="BANK OF INDIA">BANK OF INDIA</MenuItem>
     
    </Select>

                          
      <TextField type='email' id='accountNumber' onChange={(e)=>{setAccountNumber(e.target.value)}} margin='normal' variant='outlined' label='Account Number'></TextField>
      <TextField type='email' id="ifscCode" onChange={(e)=>{setIfsc(e.target.value)}} margin='normal' variant='outlined' label='IFSC Code'></TextField>
     <Typography sx={{ fontSize: '14px', color: '#776B5D'}}> Please cross-check details. Cannot be edited further.</Typography>
      <Button type='submit' onClick={saveBankDetails} variant='contained' 
              sx={{
                    marginTop:3,
                    textTransform:'capitalize',
                    fontWeight: '300',
                    fontSize: 16
                    }} 
              size='large'>Submit Details</Button>

    </Box>



        ) : (
            <>
            <div >

            {/* 1st Line: Bank Name */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                      <div style={{ flex: '1' }}>
                          <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                          Bank Name
                          </Typography>
                          <Typography variant="body1">
                          {bankDetails.bank_name}
                          </Typography>
                      </div>
                    
              </div>
                      <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />
      
      
        {/* 2nd Line: Account Number */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                      <div style={{ flex: '1' }}>
                          <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                          Account Number
                          </Typography>
                          <Typography variant="body1">
                          {bankDetails.account_number}
                          </Typography>
                      </div>
                    
              </div>
                      <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />
      
      
      {/* 3rd Line: IFSC Code */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                      <div style={{ flex: '1' }}>
                          <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                          IFSC Code
                          </Typography>
                          <Typography variant="body1">
                          {bankDetails.ifsc_code}
                          </Typography>
                      </div>
                    
              </div>
                      <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />
      
      
      
      
      
            <ToastContainer autoClose={2500}/>
          </div>
          </>
        )}

       


    </Grid>
    

    {isLoading && (
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



    </>
    )}
    </>
  );
}
