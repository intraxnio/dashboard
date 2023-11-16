import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CreatorScheduledPosts from './CreatorScheduledPosts';
import CreatorPublishedPosts from './CreatorPublishedPosts';
import ScheduleCampaign from './ScheduleCampaign';

export default function PublishCampaignCreator() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
      
      <Tab sx={{fontSize:'12px'}} label="Schedule A Post" />
        <Tab sx={{fontSize:'12px'}} label="Scheduled Posts" />
        <Tab sx={{fontSize:'12px'}} label="Published Campaigns" />

      </Tabs>

      {selectedTab === 0 && <ScheduleCampaign />}
      {selectedTab === 1 && <CreatorScheduledPosts />}
      {selectedTab === 2 && <CreatorPublishedPosts />}
    </Box>
  );
}
