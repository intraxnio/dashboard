import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Chip, Divider, List, ListItem, Typography, Button, Switch, Select, MenuItem} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
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
import PlanPrices from './PlanPrices';
import axios from "axios";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';







export default function BillingAndPlans() {
    
  const user = useSelector(state => state.brandUser);
  const [pricing, setPricing] = useState('month');
  const [onPlan, setOnPlan] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState('');
  const [planDetails, setPlanDetails] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // axios.post("http://localhost:8000/api/v1/brand/check-brand-plan-details", {
          axios.post("https://app.buzzreach.in/api/v1/brand/check-brand-plan-details", {
            userId: user.brand_id
          }).then(ress=>{
      
            if(ress.data.onPlan){
            setOnPlan(true);
            setPurchasedPlan(ress.data.purchased_plan);
            getPlanDetails(purchasedPlan);
            setLoading(false);
      
            }
            else if(!ress.data.onPlan){
              setOnPlan(false);
              setLoading(false);
                   
      
            }
      
          }).catch(e=>{
      
          })
      
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);



  const getPlanDetails = async (plan_id) => {

    try {
        // await axios.post("http://localhost:8000/api/v1/brand/purchased-plan-details", {
          await axios.post("https://app.buzzreach.in/api/v1/brand/purchased-plan-details", {
            planId: plan_id
          }).then(ress=>{
      
            setPlanDetails(ress.data.planDetails);
      
          }).catch(e=>{
      
          })
      
      } catch (error) {
        console.error(error);
      }
    
  };

  return (
    <>

{loading ? (<CircularProgress />) : (<>

   {onPlan ? (
    <>
     <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} sm={6} md={6}>
        <Card variant="outlined" sx={{py : 4, px : 1}}>
          <CardContent >
            <Chip label="Current Plan" size="small" variant="outlined" color="default" />
            <Typography variant="h4">Starter</Typography>
            <Divider />
            <List>
              <ListItem>
                <CampaignOutlinedIcon color="primary" />
                &nbsp;&nbsp; 3 Campaigns
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
            
            {/* <Typography variant="subtitle1" sx={{px: 2}}>$39 /month</Typography> */}


            <Button
              variant="contained"
              color="primary"
              style={{marginLeft: '16px', textTransform: 'lowercase', width: '22vh', fontSize: '18px'}}
            
            >
             $39 /month
            </Button>
          </CardActions>
        </Card>
      </Grid>
      </Grid>
     </>
   ) : (
    <PlanPrices />
   )}
   </>)}

      </>
  );
}