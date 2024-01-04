import * as React from 'react';
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
import { deepOrange, blue, indigo } from '@mui/material/colors';
import { Outlet} from "react-router-dom";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LanguageIcon from '@mui/icons-material/Language';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import InsertLinkIcon from '@mui/icons-material/InsertLink';






const drawerWidth = 240;

function ResponsiveDrawer(props) {
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

        <ListItem key="MyLinks" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/linksCard"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <InsertLinkIcon sx={{ color: deepOrange[500] }}/>
              </ListItemIcon>
              <ListItemText primary="My Links" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="CustomDomains" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/customDomains"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <LanguageIcon sx={{ color: blue[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Custom Domains" />
            </ListItemButton>
          </Link>
        </ListItem>


        <ListItem key="trackingCodes" disablePadding style={{ marginBottom : '4px'}}>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/trackingCodes"
            onClick={handleDrawerToggle}

          >
            <ListItemButton>
              <ListItemIcon>
                <CodeIcon sx={{ color: blue[500] }}/>
              </ListItemIcon>
              <ListItemText primary="Tracking Codes" />
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem key="profile" disablePadding>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/brand/profile"
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

      </List>

      <List sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
    
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

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (

    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      {/* <CssBaseline /> */}
      
      <AppBar
        position="fixed"
        // color= "transparent"
        sx={{
          width: '100%',
          maxWidth: { sm: `calc(100% - ${drawerWidth}px)` },
          background : '#F5F7F8',
          boxShadow: 'none'
        }}
      >
        <Toolbar sx={{marginTop: '10px'}}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' }, color: '#001B79' }}
          >
            <Avatar sx={{ background: '#0C356A' }} variant="rounded">
            <MenuIcon />
            </Avatar>
          </IconButton>

          <Typography sx={{color: '#2B3499', fontSize: '22px', fontWeight: 400}}>Lynk.is</Typography>
        
        </Toolbar>
      </AppBar>


      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2,  width: '100%',
        maxWidth: { sm: `calc(100% - ${drawerWidth}px)` }  }}
      >
        <Toolbar />
        <Outlet />
        
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
