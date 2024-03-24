import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';



function TotalTransactionAmount() {

  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState('');
  const user = useSelector((state) => state.brandUser);
  // const baseUrl = "http://localhost:8000/api";





  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }




  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        axios.post("/api/brand/get-total-transactions-amount", {
          userId: user.brand_id,
        }).then(ress=>{
    
            setTotalAmount((ress.data.data));
            setLoading(false);

    
        }).catch(e=>{
    
        })
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
   <>
     <Box sx={{
        backgroundColor: '#3E54AC',
        color: 'white',
        height: '140px',
        width: '300px',
        padding: '10px',
        borderRadius:'10px',
    }}
    > 
        <Typography sx={{ fontSize: '16px'}}>Total Amount</Typography>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <CircularProgress size={25} color="warning" />
        ) : (
          <Typography sx={{
            fontSize: '32px',
            textAlign: 'center',
            padding: '20px',
            color: 'orange'
          }}>Rs. {totalAmount}</Typography>
        )}
      </div>

    </Box>
   </>
  )
}

export default TotalTransactionAmount