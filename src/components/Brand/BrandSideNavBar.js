import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { Link } from 'react-router-dom';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SettingsIcon from '@mui/icons-material/Settings';
import { Outlet} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { deepOrange, green, purple, blue, orange, indigo } from '@mui/material/colors';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';




const drawerWidth = 220;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: open ? '#F5F7F8' : '#F5F7F8', // Set the background color here
  boxShadow: 'none', // Remove the shadow
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      background: '#F5F7F8', // Set your desired background color here
      ...(open && openedMixin(theme)),
      ...(!open && closedMixin(theme)),
    },
  }),
);

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open}>
      </AppBar>
      <Drawer variant="permanent" open={open} >
        <DrawerHeader sx={{justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h6" color="black">
            BroadReach
          </Typography>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton> */}
        </DrawerHeader>
        <Divider />

        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/dashboard">
              <ListItemButton  sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 1.2,
                  
                  
                }}>
            <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
                    <SpaceDashboardIcon />
      </Avatar>
            
          </ListItemIcon>
          <ListItemText primary='Dashboard' sx={{ opacity: open ? 1 : 0 }}/>
          </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/campaigns">
              <ListItemButton  sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 1.2,
                  
                }}>
            <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
            
            <Avatar sx={{ bgcolor: deepOrange[500] }} variant="rounded">
            <CampaignOutlinedIcon />
      </Avatar>
          </ListItemIcon>
          <ListItemText primary='Campaigns' sx={{ opacity: open ? 1 : 0 }}/>
          </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/transactions">
              <ListItemButton  sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 1.2,
                  
                  
                }}>
            <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <Avatar sx={{ bgcolor: purple[500] }} variant="rounded">
                    <CurrencyRupeeIcon />
      </Avatar>
            
          </ListItemIcon>
          <ListItemText primary='Purchase history' sx={{ opacity: open ? 1 : 0 }}/>
          </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/billing/plans">
              <ListItemButton  sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 1.2,
                  
                }}>
            <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <Avatar sx={{ bgcolor: indigo[500] }} variant="rounded">
                    <CreditCardIcon />
      </Avatar>
           
          </ListItemIcon>
          <ListItemText primary='Billing & plans' sx={{ opacity: open ? 1 : 0 }}/>
          </ListItemButton>
          </Link>
            </ListItem>
        </List>

        <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/profileSettings">
              <ListItemButton  sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 1.2,
                  
                  
                }}>
            <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <Avatar sx={{ bgcolor: blue[500] }} variant="rounded">
                    <SettingsIcon />
      </Avatar>
           
          </ListItemIcon>

          <ListItemText primary='Settings' sx={{ opacity: open ? 1 : 0 }}/>
          </ListItemButton>
          </Link>
            </ListItem>
        </List>

       



      <List sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
    
       <ListItem disablePadding sx={{ display: 'block' }}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/creator/support">
              <ListItemButton  sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 1.2,

                  
                }}>
            <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                  }}>
                    <Avatar sx={{ bgcolor: orange[500] }} variant="rounded">
                    <SupportAgentIcon />
      </Avatar>
           
          </ListItemIcon>
          <ListItemText primary='Support' sx={{ opacity: open ? 1 : 0 }}/>
          </ListItemButton>
          </Link>
            
            <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemText primary={`© Copyright 2023`} sx={{px: 1.2, marginTop:5, opacity: open ? 1 : 0}} />
    </ListItem>
    </ListItem>
  </List>


      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
   
       
      </Box>
    </Box>
  );
}
