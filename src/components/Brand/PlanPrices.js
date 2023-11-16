import React, { useState } from 'react';
import { Grid, Card, CardContent, CardActions, Chip, Divider, List, ListItem, Typography, Button, Switch} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';





export default function PricingCards() {
  const [pricing, setPricing] = useState('month');
  const navigate = useNavigate();


  const handlePricingToggle = () => {
    setPricing(pricing === 'month' ? 'year' : 'month');
  };
  const handleBackClick = () => {
    navigate(`/brand/campaigns`);

  };

  const handleStartNow = () => {
    // history.push(`/nextRoute?pricing=${pricing}&duration=${duration}`);
  };

  const getPrice2 = () => {
    if (pricing === 'year') {
      return '$490'; // Change to your annual price
    }
    return '$49'; // Change to your monthly price
  };

  return (
    <>
   <Button  style={{marginBottom: '18px'}} startIcon={<KeyboardBackspaceIcon /> } onClick={handleBackClick}>Back</Button>

    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Chip label="&nbsp;default&nbsp;" size="small" variant="outlined" color="default" sx={{marginBottom: '10px'}}/>
            <Typography sx={{fontSize: '32px'}}>Forever Free</Typography>
            <Divider />
            <List>
              <ListItem>
                <CampaignOutlinedIcon color="primary" />
                &nbsp;&nbsp; 1 Campaign per month
              </ListItem>
              <ListItem>
                <AllInclusiveOutlinedIcon color="primary" />
                &nbsp;&nbsp; Unlimited influencer requests
              </ListItem>
              <ListItem>
                <BarChartOutlinedIcon color="primary" />
                &nbsp;&nbsp; Real time analytics
              </ListItem>
              <ListItem>
                <DescriptionOutlinedIcon color="primary" />
                &nbsp;&nbsp; WhiteLabel Reporting
              </ListItem>
              <ListItem>
                <QueryStatsOutlinedIcon color="primary" />
                &nbsp;&nbsp; Creator Insights
              </ListItem>
              <ListItem>
                <DoneAllOutlinedIcon color="primary" />
                &nbsp;&nbsp; AI post verification
              </ListItem>
              <ListItem>
                <EmailOutlinedIcon color="primary" />
                &nbsp;&nbsp; Email Support
              </ListItem>
              <ListItem>
                <PhoneOutlinedIcon color="primary" />
                &nbsp;&nbsp; Phone Support
              </ListItem>
            </List>
            <Divider />
          </CardContent>
          <CardActions>
            {/* <Switch
              checked={pricing === 'year'}
              onChange={handlePricingToggle}
            /> */}
            
            {/* <Typography variant="subtitle1">{getPrice() + '/'}{pricing === 'year' ? 'year' : 'month'}</Typography>


            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleStartNow}
              style={{marginLeft: '16px'}}
            >
              Start Plan
            </Button> */}
          </CardActions>
        </Card>
      </Grid>
      

      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Chip label="popular" size="small" variant="outlined" color="default" sx={{marginBottom: '10px'}} />
            <Typography sx={{fontSize: '32px'}}>Unlimited</Typography>
            <Divider />
            <List>
            <ListItem>
                <CampaignOutlinedIcon color="primary" />
                &nbsp;&nbsp; Unlimited Campaigns
              </ListItem>
              <ListItem>
                <AllInclusiveOutlinedIcon color="primary" />
                &nbsp;&nbsp; Unlimited influencer requests
              </ListItem>
              <ListItem>
                <BarChartOutlinedIcon color="primary" />
                &nbsp;&nbsp; Real time analytics
              </ListItem>
              <ListItem>
                <DescriptionOutlinedIcon color="primary" />
                &nbsp;&nbsp; WhiteLabel Reporting
              </ListItem>
              <ListItem>
                <QueryStatsOutlinedIcon color="primary" />
                &nbsp;&nbsp; Creator Insights
              </ListItem>
              <ListItem>
                <DoneAllOutlinedIcon color="primary" />
                &nbsp;&nbsp; AI post verification
              </ListItem>
              <ListItem>
                <EmailOutlinedIcon color="primary" />
                &nbsp;&nbsp; Email Support
              </ListItem>
              <ListItem>
                <PhoneOutlinedIcon color="primary" />
                &nbsp;&nbsp; Phone Support
              </ListItem>
            </List>
            <Divider />
          </CardContent>
          <CardActions>
            <Switch
              checked={pricing === 'year'}
              onChange={handlePricingToggle}
            />
            
            <Typography variant="subtitle1">{getPrice2() + '/'}{pricing === 'year' ? 'year' : 'month'}</Typography>


            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleStartNow}
              style={{marginLeft: '16px'}}
            >
              Upgrade Now
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
    </>
  );
}