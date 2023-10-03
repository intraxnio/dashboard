// import React from 'react';
// import { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
// import CreatorInsights from './CreatorInsights';
// import BrandSignup from './BrandSignup';
// import Navbar from './Navbar';
// import CreatorCampaigns from './CreatorCampaigns';
// import PublishCampaignCreator from './PublishCampaignCreator';
// import { Link } from 'react-router-dom';
// import BrandMainScreen from './BrandMainScreen';
// import CampaignCard from './CampaignCard';

// const drawerWidth = 180;

// export default function BrandSideNavBar() {


//   const [menuData, setMenuData] = useState("homepage"); // Set a default value

//   useEffect(() => {
//     const storedMenuItem = localStorage.getItem('brandMenuItem');
//     if (storedMenuItem) {
//       setMenuData(storedMenuItem);
//     }
//   }, []);

//   const handleMenuItemClick = (menuItem) => {
//     setMenuData(menuItem);
//     localStorage.setItem('brandMenuItem', menuItem); // Store in local storage
//   };

//   return (
//     <>
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
//       >
//         {/* <Toolbar>
//           <Typography variant="h6" noWrap component="div">
//             Instagram
//           </Typography>
//         </Toolbar> */}
//     {/* <Navbar /> */}

//       </AppBar>
//       <Drawer
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//         },
//       }}
//       variant="permanent"
//       anchor="left"
//     >
//         <Toolbar />
//         <Divider />
//         <List>
//             <ListItem disablePadding>
//             <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/dashboard">
//             <ListItemButton onClick={() => handleMenuItemClick("homepage")}>
//               <ListItemIcon>
//                 <InboxIcon />
//               </ListItemIcon>
//               <ListItemText primary='Dashboard' />
//             </ListItemButton>
//           </Link>
//             </ListItem>
//         </List>

//         <List>
//             <ListItem disablePadding>
//             <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/campaigns">
//             <ListItemButton onClick={() => handleMenuItemClick("campaigns")}>
//               <ListItemIcon>
//                 <InboxIcon />
//               </ListItemIcon>
//               <ListItemText primary='Campaigns' />
//             </ListItemButton>
//           </Link>
//             </ListItem>
//         </List>

//         <List>
//             <ListItem disablePadding>
//             <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/invitations">
//             <ListItemButton onClick={() => handleMenuItemClick("invitations")}>
//               <ListItemIcon>
//                 <InboxIcon />
//               </ListItemIcon>
//               <ListItemText primary='Invitations' />
//             </ListItemButton>
//           </Link>
//             </ListItem>
//         </List>

//         <List>
//             <ListItem disablePadding>
//             <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/payouts">
//             <ListItemButton onClick={() => handleMenuItemClick("payouts")}>
//               <ListItemIcon>
//                 <InboxIcon />
//               </ListItemIcon>
//               <ListItemText primary='Payouts' />
//             </ListItemButton>
//           </Link>
//             </ListItem>
//         </List>

//         <List>
//             <ListItem disablePadding>
//             <Link style={{ textDecoration: 'none', color: 'black' }} to="/brand/settings">
//             <ListItemButton onClick={() => handleMenuItemClick("settings")}>
//               <ListItemIcon>
//                 <InboxIcon />
//               </ListItemIcon>
//               <ListItemText primary='Settings' />
//             </ListItemButton>
//           </Link>
//             </ListItem>
//         </List>

//         <Divider />
       
//       </Drawer>
//       <Box
//         component="homepage"
//         sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
//         {menuData === "homepage" && <BrandMainScreen/>}
//         {menuData === "campaigns" && <CampaignCard/>}
//         {menuData === "invitations" && <CampaignCard/>}
//         {menuData === "payouts" && <BrandSignup/>}
//         {menuData === "settings" && <BrandSignup/>}
      
//         <Toolbar />
       
       
//       </Box>
//     </Box>
//     </>
//   );
  
// }