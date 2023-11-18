import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux';
import {login} from '../../store/creatorSlice';




function InstagramCode() {

  const user = useSelector(state => state.creatorUser);
  const navigate = useNavigate();
    const location = useLocation();
    const access_code = new URLSearchParams(location.search).get('code');
    var fb_redirecturl = 'https://app.broadreach.in/insta_graph_dialogue';
  const dispatch = useDispatch();
  const baseUrl = "https://13.234.41.129:8000/api";


  
    const makeSecondRequest = (id) => {
      return axios.post("/api/creator/fb_insta_redirect_url", {
        access_code,
        fb_redirecturl,    
        userId: id });
    };


      useEffect(() => {
        const fetchData = async () => {
          try {
    
            const secondResponse = await makeSecondRequest(user.creator_id);
            if(secondResponse.data !=null){

           dispatch(login({...user, isInstagramLinked: true}));


              navigate("/creator/getAllCampaigns");
              // window.location.reload(true);

            }
            // setCampaignData(secondResponse.data.data);

        }
          catch (error) {
            console.error(error);
          }
        };
    
        fetchData();
      }, []);




   
  return (
    <div>
        {
            // error ? (<p>Your token is expired</p>): (<p>Account has been created</p>) 

        }
    </div>
  )
}

export default InstagramCode