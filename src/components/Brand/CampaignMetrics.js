import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CampaignMetricsIndividualPosts from "./CampaignMetricsIndividualPosts";


function CampaignMetrics() {

  const user = useSelector(state => state.brandUser);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");
  const [totalCreators, setTotalCreator] = useState('');
  const [totalReach, setTotalReach] = useState('');
  const [totalImpressions, setTotalImpressions] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";




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
      axios.post("/api/brand/completed-campaign-metrics", {
        campaignId: campaignId,
      }).then(ress=>{
        
          setTotalCreator(ress.data.data.verifiedPosts);
          setTotalReach(ress.data.data.reach);
          setTotalImpressions(ress.data.data.impressions);
          setTotalBudget(ress.data.data.budget);
  
      }).catch(e=>{
  
      })
  }, []);

  const handleBackClick = () => {
    navigate(`/brand/campaigns/${campaignId}/details`);

  };


  return (
    <> 

         <TableContainer sx={{padding:'10px'}}>

         <CampaignMetricsIndividualPosts campaignId={campaignId} />

         </TableContainer>
        
    

    </>
  );
}

export default CampaignMetrics;
