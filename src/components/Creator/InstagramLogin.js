import React from 'react'
import axios from 'axios';
import { Button } from '@mui/material';




// var fbAppID = '1753581615062204';
var fbAppID = '957873452119557';
// var fb_redirecturl = 'https://localhost:4700/insta_redirect_url';
var fb_redirecturl = 'https://localhost:4700/insta_graph_dialogue';

function InstagramLogin() {
    
  async function submit(e) {

        e.preventDefault();
        try{

            // var url = 'https://api.instagram.com/oauth/authorize?client_id='+ fbAppID +'&redirect_uri='+fb_redirecturl+'&response_type=code&scope=user_profile,user_media,instagram_graph_user_media,instagram_graph_user_profile';
            var url = 'https://www.facebook.com/v17.0/dialog/oauth?client_id='+ fbAppID +'&redirect_uri='+fb_redirecturl+'&config_id=746579797244533';
            window.open(url, "_blank").focus();
         
        }
    catch(e){
        console.log(e);
    }
  }


  return (
   <>
   <Button variant='contained'
   onClick={submit}>Login with Instagram</Button>
   </>
  )
}

export default InstagramLogin