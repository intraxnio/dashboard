import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CampaignsOpenForCreator from './CampaignsOpenForCreator';
import CampaignsShownInterestedByCreator from './CampaignsShownInterestedByCreator';
import CampaignsApprovedForCreator from './CampaignsApprovedForCreator';

export default function CreatorCampaigns() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab sx={{fontSize:'12px'}} label="New Campaigns" />
        <Tab sx={{fontSize:'12px'}} label="My Campaigns" />
        {/* <Tab sx={{fontSize:'12px'}} label="Approved Campaigns" /> */}
      </Tabs>

      {selectedTab === 0 && <CampaignsOpenForCreator />}
      {selectedTab === 1 && <CampaignsShownInterestedByCreator />}
      {/* {selectedTab === 2 && <CampaignsApprovedForCreator />} */}
    </Box>
  );
}
