import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography, Grid, TextField, Dialog, Select, MenuItem, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useDispatch } from "react-redux";
import { logout } from "../../store/creatorSlice";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';








export default function AccountSettings() {

  const user = useSelector(state => state.creatorUser);
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [originalPassword, setOriginalPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordDialogue, setPasswordDialogue] = useState(false);

  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";






  const handleSignOut = () => {
    dispatch(logout());
    navigate(`/login/creator`);
   
  };




const fetchProfile = useCallback(async () => {
  try {
    axios.post(baseUrl + "/creator/email-mobile", {
      userId: user.creator_id,
    }).then(ress => {
      setCategory(ress.data.data.category);
      setEmail(ress.data.data.email);
      setMobile(ress.data.data.mobile_num);
      setLoading(false);
    }).catch(e => {
      // Handle error
    });
  } catch (error) {
    console.error(error);
  }
}, [user.creator_id]);

useEffect(() => {


  if(!user.creator_id){

    navigate("/login/creator");

  }
  else if(user.creator_id){
  fetchProfile();

  }


}, [fetchProfile]);




  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };



  const handleDialogPasswordClose = () => {
    setPasswordDialogue(false);
  };


  const updatePassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);


    if(!originalPassword || !newPassword){
        setIsLoading(false);
        toast.warning("Enter Valid Password");
      }


      else {


      await axios.post(baseUrl+"/creator/change-password",
        { userId: user.creator_id, password : originalPassword, newPassword : newPassword },
        {withCredentials: true}
      )
      .then((res) => {


            if(!res.data.success){

                setIsLoading(false);
                toast.error("Password update failed. Please try again.");

            }
            else if(res.data.success){
                
                setIsLoading(false);
                setPasswordDialogue(false);
                toast.success("Password updated successfully");
                
            }

      })
      .catch((err) => {


        if (err.response && err.response.data.error === "Wrong current password") {
          toast.warning("Wrong current password");
        } 

        else if (err.response && err.response.data.error === "email, password mismatch") {
          toast.warning("Invalid email or password");
        } 
        
        else {
          toast.error("An error occurred. Please try again later.");
        }
      });

    }

    
  };

  const handleBackClick = () => {
    navigate(`/creator/profile`);

  };



  return (
    <>

   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>


    {loading ? (<CircularProgress />) : (
    <>
    <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={8}>
<div >
      {/* 1st Line: Email */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Email
                    </Typography>
                    <Typography variant="body1">
                    {email}
                    </Typography>
                </div>
              
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />


{/* 2nd Line: Mobile  */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Mobile
                    </Typography>
                    <Typography variant="body1">
                    {mobile}
                    </Typography>
                </div>
              
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />


      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Password
                    </Typography>
                    <Typography variant="body1">
                    **********
                    </Typography>
                </div>
                <Button variant="outlined" color="primary" onClick={()=> {setPasswordDialogue(true)}}>
                    Change Password
                </Button>
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />

      {/* 5th Line: Signout Button */}
      <div style={{ textAlign: 'start'}}>
        <Button variant="outlined" color="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <ToastContainer autoClose={2500}/>
    </div>


    </Grid>
    </Grid>

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


{user && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={passwordDialogue}
            onClose={handleDialogPasswordClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter current password
              </Typography>

              <TextField
                type="password"
                id="originalPassword"
                onChange={(e) => {
                  setOriginalPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Current Password"
              />

              <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter new password
              </Typography>

              <TextField
                type="password"
                id="newPassword"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="New Password"
              />

        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setPasswordDialogue(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" onClick={updatePassword}>
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}
    </>
    )}
    </>
  );
}
