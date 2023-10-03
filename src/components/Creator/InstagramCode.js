import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux';
import {login} from '../../store/creatorSlice';




function InstagramCode() {

  const navigate = useNavigate();
    const location = useLocation();
    let parameters = new URLSearchParams(location.search).get('code');
    const access_code = parameters;
    var fb_redirecturl = 'https://localhost:4700/insta_graph_dialogue';
    const dispatch = useDispatch();

    const [error, setError] = useState(false);
    const [userId, setUserId] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);



    const makeFirstRequest = () => {
      return axios.get("http://localhost:8000/api/v1/creator/getCreator", {
          withCredentials: true
        });
    };
  
    const makeSecondRequest = (id) => {
      return axios.post("http://localhost:8000/api/v1/creator/fb_insta_redirect_url", {
        access_code,
        fb_redirecturl,    
        userId: id });
    };


      useEffect(() => {
        const fetchData = async () => {
          try {
            const firstResponse = await makeFirstRequest();
            if(firstResponse.data.data == null){
                setIsLoggedIn(false);
            }
            else{
            setUserId(firstResponse.data.data);
            setIsLoggedIn(true);
    
            const secondResponse = await makeSecondRequest(firstResponse.data.data);
            if(secondResponse.data !=null){
              // console.log('Second Response:::::', secondResponse.data);
              const creator_id = secondResponse.data.data._id;
              const email = secondResponse.data.data.email;
              const creator_category = secondResponse.data.data.category;
           
              const userDetails = { email, creator_id, creator_category };
              
              dispatch(login(userDetails));
              navigate("/creator/dashboard");
              // window.location.reload(true);

            }
            // setCampaignData(secondResponse.data.data);
          

            console.log('response:', secondResponse);
        }
          } catch (error) {
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