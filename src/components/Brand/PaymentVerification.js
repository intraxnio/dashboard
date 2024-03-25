import React, { useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { Paper, Grid, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircularProgress from '@mui/material/CircularProgress';



function PaymentVerification() {

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentRes, setPaymentRes] = useState("");


  // const baseUrl = "http://localhost:8000/api";

  const fetchData = async (razorpay_payment_id, razorpay_payment_link_id, razorpay_payment_link_reference_id,
    razorpay_payment_link_status, razorpay_signature) => {
    try {

      setLoading(true);

      await axios.post("/api/brand/verifyPayment",
        {
            razorpay_payment_id : razorpay_payment_id,
            razorpay_payment_link_id : razorpay_payment_link_id,
            razorpay_payment_link_reference_id : razorpay_payment_link_reference_id,
            razorpay_payment_link_status : razorpay_payment_link_status,
            razorpay_signature : razorpay_signature
        }).then(paymentRes => {

          setPaymentRes(paymentRes.data.data);
          setLoading(false);


        }).catch(er => {
        // Handle error
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const razorpay_payment_id = queryParams.get('razorpay_payment_id');
    const razorpay_payment_link_id = queryParams.get('razorpay_payment_link_id');
    const razorpay_payment_link_reference_id = queryParams.get('razorpay_payment_link_reference_id');
    const razorpay_payment_link_status = queryParams.get('razorpay_payment_link_status');
    const razorpay_signature = queryParams.get('razorpay_signature');

    fetchData(razorpay_payment_id,
        razorpay_payment_link_id,
        razorpay_payment_link_reference_id,
        razorpay_payment_link_status,
        razorpay_signature);
   
  }, [location.search]);

  return (
    <>
    <Grid container justifyContent='center' marginTop='26px' paddingX='12px' paddingY='36px'>

    <Grid item xs={12} md={4}>
    <Paper variant="elevation">

      <Stack sx={{ display : 'flex', flexDirection : 'row', justifyContent: 'center', paddingTop: '26px', marginBottom : '22px'}}>
      <DoneAllIcon color="success"/>
      <Typography sx={{marginLeft : '12px', fontWeight : '500'}}>Payment Successful</Typography>
      </Stack>

      <Stack sx={{ display : 'flex', flexDirection : 'row', marginLeft: '22px', paddingTop :'36px', paddingBottom : '60px'}}>
        <Stack>
        <Typography sx={{ marginBottom : '12px'}} >Payee Name</Typography>
      <Typography sx={{ marginBottom : '12px'}}>Transaction Id</Typography>
      <Typography sx={{ marginBottom : '12px'}}>Date</Typography>
      <Typography sx={{ marginBottom : '12px'}}>Amount</Typography>
      <Typography sx={{ marginBottom : '12px'}}>Status</Typography>

        </Stack>

        <Stack marginLeft='12px'>
        <Typography sx={{ marginBottom : '12px'}}>: {paymentRes.payee_name}</Typography>
      <Typography sx={{ marginBottom : '12px'}}>: {paymentRes.invoice_number}</Typography>
      <Typography sx={{ marginBottom : '12px'}}>: {paymentRes.created_at}</Typography>
      <Typography sx={{ marginBottom : '12px'}}>: {paymentRes.invoice_amount} </Typography>
      <Typography sx={{ marginBottom : '12px', color : 'green'}}>: {paymentRes.is_payment_captured ? 'PAID' : 'FAILED'} </Typography>

        </Stack>
     
      </Stack>

      


      
    </Paper>


    </Grid>

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
    </Grid>
   
    </>
  )
}

export default PaymentVerification