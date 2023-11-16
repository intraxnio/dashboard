import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";





export default function BalanceComponent() {

const user = useSelector(state => state.brandUser);
const [balance, setBalance] = useState('');
// const baseUrl = "http://localhost:8000/api";
const baseUrl = "http://13.234.41.129:8000/api";




useEffect(() => {
      axios.post(baseUrl+ "/brand/get-account-balance", {
      brand_id: user.brand_id
    }).then(ress=>{

        setBalance(ress.data.balance);


    }).catch(e=>{

    })
  }, []);


const createCampaign = async (e) => {
    e.preventDefault();
  window.open(`/campaign`, '_blank');

  };

  return (
    <>

<Button
        variant="outlined"
        onClick={createCampaign} // Define your button click handler
        style={{
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }}
        sx={{marginRight: '10px'}}
      >
        Add Funds
      </Button>
      <Button
        variant="outlined"
        onClick={createCampaign} // Define your button click handler
        style={{
          cursor: 'pointer',
          textDecoration: 'none',
          textTransform: 'none'
        }}
      >
        Balance: Rs. {balance}
      </Button>
    </>
  );
}
