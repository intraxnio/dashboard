import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CampaignNewRequests from './CampaignNewRequests';
import CampaignApprovedRequests from './CampaignApprovedRequests';
import CampaignDeclinedRequests from './CampaignDeclinedRequests';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import BrandShowCampaignDetails from './BrandShowCampaignDetails';



export default function PublishCampaignCreator() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get("campaignId");



  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleBackClick = () => {
    navigate(`/brand/campaigns`);

  };



  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>

    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>


      <Tab sx={{fontSize:'12px'}} label="Campaign Details" />
      <Tab sx={{fontSize:'12px'}} label="New Requests" />
        <Tab sx={{fontSize:'12px'}} label="Approved Requests" />
        {/* <Tab sx={{fontSize:'12px'}} label="Declined Requests" /> */}

      </Tabs>

      {selectedTab === 0 && <BrandShowCampaignDetails />}
      {selectedTab === 1 && <CampaignNewRequests />}
      {selectedTab === 2 && <CampaignApprovedRequests />}
      {/* {selectedTab === 3 && <CampaignDeclinedRequests />} */}
     
    </Box>
    
    </>

  );
}
