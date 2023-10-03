import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useSelector } from "react-redux";
import { Button, TableContainer} from "@mui/material";





export default function BalanceComponent() {

const location = useLocation();
const navigate = useNavigate();
const searchParams = new URLSearchParams(location.search);
const user = useSelector(state => state.brandUser);
const campaignId = searchParams.get("campaignId");
const [userId, setUserId] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [balance, setBalance] = useState('');

useEffect(() => {
    // axios.post("http://localhost:8000/api/v1/brand/get-account-balance", {
      axios.post("https://app.buzzreach.in/api/v1/brand/get-account-balance", {
      brand_id: user.brand_id
    }).then(ress=>{

        setBalance(ress.data.balance);


    }).catch(e=>{

    })
  }, []);


const createCampaign = async (e) => {
    e.preventDefault();

      // navigate("/campaign");
      // window.location.reload(true);
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
