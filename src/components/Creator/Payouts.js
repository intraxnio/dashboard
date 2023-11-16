import React, { useEffect, useState } from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Tooltip } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';












export default function Payouts() {

  const user = useSelector(state => state.creatorUser);
  const navigate = useNavigate();
  const [balance, setBalance] = useState('');
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "http://13.234.41.129:8000/api";





  const fetchData = async () => {
    // try {

    //   const fetchBalance = await axios.post(baseUrl+"/brand/get-account-balance",
    //     {
    //       brand_id: user.brand_id,
    //     }
    //   );

    //   setBalance(fetchBalance.data.balance);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {

    if(!user.creator_id){

      navigate("/login/creator");

    }

    else if(user.creator_id){
      fetchData();
    }
  }, []);
    




  return (
    <>

<Button startIcon={<KeyboardBackspaceIcon />} onClick={()=> { navigate("/creator/profile")}}>Back</Button>



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
    <div> Recent payouts will show up here</div>
  </div>

      </>
  );
}