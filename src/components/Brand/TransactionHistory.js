import React, { useEffect, useState } from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Tooltip } from "@mui/material";











export default function TransactionHistory() {

  const user = useSelector(state => state.brandUser);
  const navigate = useNavigate();
  const [balance, setBalance] = useState('');
  const baseUrl = "http://localhost:8000/api";




  const fetchData = async () => {
    try {

      const fetchBalance = await axios.post(baseUrl+"/brand/get-account-balance",
        {
          brand_id: user.brand_id,
        }
      );

      setBalance(fetchBalance.data.balance);
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
    




  return (
    <>


<div
           style={{
             display: "flex",
             justifyContent: "flex-end",
             marginBottom: "10px",
           }}
         >
           <Button
             variant="outlined"
             style={{
               cursor: "pointer",
               textDecoration: "none",
               textTransform: "none",
             }}
             sx={{ marginRight: "10px" }}
           >
             Buy Credits
           </Button>
           <Tooltip title={`${balance} Credits = Rs. ${balance}`} arrow>

           <Button
             variant="outlined"
             style={{
               
               textDecoration: "none",
               textTransform: "none",
             }}
             sx={{ paddingX: "20px" }}

           >
             Credits: &nbsp;{balance}
           </Button>
           </Tooltip>
         </div>

<div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh", // Adjust the height as needed
    }}
  >
    <ReceiptIcon style={{ fontSize: '60px', marginBottom: '20px', color: '#5D12D2'}}/>
    <div> Recent transactions will show up here</div>
  </div>

      </>
  );
}