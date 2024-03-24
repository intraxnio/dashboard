import React, { useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Divider, List, ListItem, Typography, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";





export default function SupportPage() {

  const user = useSelector(state => state.brandUser);
  const navigate = useNavigate();

  useEffect(() => {

    if(!user.brand_id){

      navigate("/");

    }
    


  }, []);


  return (
    <>

    <Grid container justifyContent="center" spacing={4} sx={{marginTop: 5}}>
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{marginBottom: 3}}>Email Support</Typography>
            <Divider />
            <List>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Priority Email Support
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; 48hr Resolution Window
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Account Setup
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Catalogue Setup
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Bugs Resolution
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; On-demand Reports (PDF)
              </ListItem>
             
            </List>
            <Divider />
          </CardContent>
          <CardActions>
        
            {/* <Typography variant="subtitle1">{getPrice() + '/'}{pricing === 'year' ? 'year' : 'month'}</Typography> */}


            <Button
              variant="outlined"
              color="secondary"
              startIcon={<MailOutlineIcon />}
              style={{marginLeft: '16px', textTransform: 'lowercase'}}
            >
              support@billsbook.online
            </Button>
          </CardActions>
        </Card>
      </Grid>
      

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{marginBottom: 3}}>Phone Support</Typography>
            <Divider />
            <List>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Priority Phone Support
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Monday - Friday
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; 10:00AM - 05:00PM IST
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Account Setup
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Catalogue Setup
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; On-demand Reports (PDF)
              </ListItem>
             
            </List>
            <Divider />
          </CardContent>
          <CardActions>
        
            {/* <Typography variant="subtitle1">{getPrice() + '/'}{pricing === 'year' ? 'year' : 'month'}</Typography> */}


            <Button
              variant="outlined"
              color="primary"
              startIcon={<CallIcon />}
              style={{marginLeft: '16px', textTransform: 'lowercase'}}
            >
              +91 6305420874
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
    </>
  );
}