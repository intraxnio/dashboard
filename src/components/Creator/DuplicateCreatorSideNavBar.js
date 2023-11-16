import React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CreatorInsights from './CreatorInsights';
import BrandSignup from '../Brand/BrandSignup';
import Navbar from '../Navbar';
import CreatorCampaigns from './CreatorCampaigns';
import PublishCampaignCreator from './PublishCampaignCreator';
import { Link } from 'react-router-dom';

const drawerWidth = 180;

export default function CreatorSideNavBar() {


  const [menuData, setMenuData] = useState("homepage"); // Set a default value

  useEffect(() => {
    const storedMenuItem = localStorage.getItem('brandSelectedMenuItem');
    if (storedMenuItem) {
      setMenuData(storedMenuItem);
    }
  }, []);

  const handleMenuItemClick = (menuItem) => {
    setMenuData(menuItem);
    localStorage.setItem('brandSelectedMenuItem', menuItem); // Store in local storage
  };
  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        {/* <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Instagram
          </Typography>
        </Toolbar> */}
    {/* <Navbar /> */}

      </AppBar>
      <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
        <Toolbar />
        <Divider />
        <List>
            <ListItem disablePadding>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/dashboard">
            <ListItemButton onClick={() => handleMenuItemClick("homepage")}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/insights">
            <ListItemButton onClick={() => handleMenuItemClick("insights")}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Insights' />
            </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/getAllCampaigns">
            <ListItemButton onClick={() => handleMenuItemClick("campaigns")}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Campaigns' />
            </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/publishPost">
            <ListItemButton onClick={() => handleMenuItemClick("publish")}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Publish' />
            </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/profile">
            <ListItemButton onClick={() => handleMenuItemClick("profile")}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Profile' />
            </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/settings">
            <ListItemButton onClick={() => handleMenuItemClick("settings")}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Settings' />
            </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <Divider />
       
      </Drawer>
      <Box
        component="div"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        {menuData === "homepage" && <CreatorInsights/>}
        {menuData === "insights" && <CreatorInsights/>}
        {menuData === "campaigns" && <CreatorCampaigns/>}
        {menuData === "profile" && <BrandSignup/>}
        {menuData === "settings" && <BrandSignup/>}
        {menuData === "publish" && <PublishCampaignCreator/>}
      
        <Toolbar />
       
       
      </Box>
    </Box>
    </>
  );
  
}