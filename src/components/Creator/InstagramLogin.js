import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Box, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useDispatch } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";
import {login} from '../../store/creatorSlice';








function InstagramLogin() {

  var fbAppID = '957873452119557';
  var fb_redirecturl = 'https://localhost:4700/insta_graph_dialogue';
  const user = useSelector(state => state.creatorUser);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "http://13.234.41.129:8000/api";







  useEffect(() => {

    const fetchData = async () => {

      try {

        axios.post(baseUrl+"/creator/profile-followers-name-image", {
          userId: user.creator_id,
        }).then(ress=>{
    
            setProfile(ress.data.data);
            setIsLoading(false);

    
        }).catch(e=>{
    
        })
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);


    
  async function submit(e) {

        e.preventDefault();
        try{

            // var url = 'https://api.instagram.com/oauth/authorize?client_id='+ fbAppID +'&redirect_uri='+fb_redirecturl+'&response_type=code&scope=user_profile,user_media,instagram_graph_user_media,instagram_graph_user_profile';
            var url = 'https://www.facebook.com/v17.0/dialog/oauth?client_id='+ fbAppID +'&redirect_uri='+fb_redirecturl+'&config_id=746579797244533';
            window.open(url, '_self').focus();
         
        }
    catch(e){
        console.log(e);
    }
  }


  async function unlinkAccount(e) {

    e.preventDefault();
   dispatch(login({...user, isInstagramLinked: false}));

   
}





  return (
   <>

<Button startIcon={<KeyboardBackspaceIcon />} sx={{marginBottom: '10%'}} onClick={()=> { navigate('/creator/profile')}}>Back</Button>

{user.isInstagramLinked ? ( 
  <>


  <Grid xs={12} sm={6} md={6} >

  <Box sx={{display: 'flex', flexDirection: 'column', paddingX : '20%'}}>

   <Button         
                startIcon= {< InstagramIcon />}
                type="submit"
                onClick={submit}
                variant="contained"
                sx={{
                  marginTop: 3,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                  background : '#C70039',
                  width : '100%',
                  justifyContent: 'center'

                }}
                size="large"
              >
                {profile.iG_name}
              </Button>


              <Button         
                startIcon= {< LogoutIcon />}
                type="submit"
                onClick={unlinkAccount}
                variant="outlined"
                sx={{
                  marginTop: 3,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                  // background : '#C70039',
                  width : '200px',
                  justifyContent: 'space-evenly'

                }}
                size="large"
              >
                Unlink Account
              </Button>

  </Box>

  </Grid>

   </>
) : ( 
  <>
   <Button         
                startIcon= {< FacebookIcon />}
                type="submit"
                onClick={submit}
                variant="contained"
                sx={{
                  marginTop: 5,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                  background : '#3E54AC'

                }}
                size="large"
              >
                Login with Facebook
              </Button> </>
)}

             




              {isLoading && (
          <CircularProgress
            size={24}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -12, // Center the CircularProgress
              marginLeft: -12, // Center the CircularProgress
            }}
          />
        )}

   </>
  )
}

export default InstagramLogin