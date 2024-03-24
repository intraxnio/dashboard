import React, { useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { deepOrange, blue, indigo, green, purple } from '@mui/material/colors';
import { Outlet} from "react-router-dom";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LanguageIcon from '@mui/icons-material/Language';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: green[500],
    },
    warning: {
      main: purple[500],
    },
    info: {
      main: blue[500],
    },
  },
});


const ResponsiveDrawer = (props) => {

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />

      <List>

        <ListItem key="Dashboard" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/dashboard"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <InsertLinkIcon sx={{ color: deepOrange[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="Invoices" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/invoices"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <LanguageIcon sx={{ color: blue[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Invoices" />
            </ListItemButton>
          </Link>
        </ListItem>


        <ListItem key="Products" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/products"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <CodeIcon sx={{ color: blue[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="Profile" disablePadding>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/profileSettings"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon sx={{ color: blue[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="Support" disablePadding>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/support"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <SupportAgentIcon sx={{ color: indigo[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>
          </Link>
        </ListItem>

      </List>


      <Divider />
    </div>
  );

  // Check if window is defined (during SSR it might not be available)
  const container = window !== undefined ? () => window().document.body : undefined;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isSmallScreen ? '100%' : 240;


  return (
    <ThemeProvider theme={theme}>

    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      <Box sx={{ flexGrow: 1 }}>
        { isSmallScreen ? (
          <AppBar
          position="fixed"
          sx={{
            width: '100%',
            maxWidth: { sm: `calc(100% - ${drawerWidth}px)` },
            background: '#F5F7F8',
            boxShadow: 'none',
            top: 'auto', // Remove fixed positioning
            bottom: 0, // Position at the bottom
          }}
        >
         <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          
      <IconButton
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          color: '#001B79',
        }}
      >
          <ArrowUpwardIcon />
      </IconButton>

        </Toolbar>
        </AppBar>
        ) : (null)}
      </Box>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          anchor="bottom"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {  width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1,  width: '100%', overflow: 'auto',
        maxWidth: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      
    </Box>

    </ThemeProvider>



  );
};

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
