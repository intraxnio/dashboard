import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Avatar, Typography, Grid, TextField, Dialog, Select, MenuItem, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useDispatch } from "react-redux";
import { logout } from "../../store/brandSlice";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';







export default function ProfileSettings() {

  const user = useSelector(state => state.brandUser);
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [logo, setLogo] = useState('');
  const [newName, setNewName] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isInstagramDialogOpen, setIsInstagramDialogOpen] = useState(false);
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
    navigate(`/`);
   
  };




const fetchProfile = useCallback(async () => {
  try {
    axios.post("/api/brand/settings-brand-details", {
      userId: user.brand_id,
    }).then(ress => {
      setBrandName(ress.data.brandDetails.brand_name);
      setCategory(ress.data.brandDetails.category);
      setEmail(ress.data.brandDetails.email);
      setHandle(ress.data.brandDetails.instagram_handle);
      setLogo(ress.data.brandDetails.brand_logo);
      setLoading(false);
    }).catch(e => {
      // Handle error
    });
  } catch (error) {
    console.error(error);
  }
}, [user.brand_id]);

useEffect(() => {


  if(!user.brand_id){

    navigate("/");

  }
  else if(user.brand_id){
  fetchProfile();

  }


}, [fetchProfile]);

  const openFileExplorer = () => {
    // Programmatically trigger a click event on the hidden file input
    fileInputRef.current.click();
  };


  const updateLogo = async (e) => {
    e.preventDefault();
  
    const selectedFile = e.target.files[0]; // Get the selected file
    const formData = new FormData();
    formData.append('brand_id', user.brand_id);
    formData.append('image', selectedFile);
  
    try {
        const response = await axios.post("/api/brand/update-brand-logo", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.updated) {
        toast.success("Logo is updated");
        fetchProfile();
      } else {
        console.log('Logo Update error');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  const handleDialogPasswordClose = () => {
    setPasswordDialogue(false);
  };

  const handleCloseCategoryDialog = () => {
    setIsCategoryDialogOpen(false); // Close the dialog
  };

   const handleInstagramCloseDialog = () => {
    setIsInstagramDialogOpen(false); // Close the dialog
  };

  const handleOpenDialog = () => {

      setIsDialogOpen(true); // Open the dialog

  };

  const handleOpenCategoryDialog = () => {
    setNewCategory(category);
    setIsCategoryDialogOpen(true); // Open the dialog

};

const handleOpenInstagramDialog = () => {
  setNewInstagram(handle);
  setIsInstagramDialogOpen(true); // Open the dialog

};

const updateBrandName = () => {
      axios.post("/api/brand/update-brand-name", {
        brand_id: user.brand_id,
        newBrandName: newName,
      })
      .then((ress) => {
        if (ress.data.updated) {
            toast.success("Brand Name is updated");
            fetchProfile();
        } else if (!ress.data.success) {
            toast.success("Update failed");
        }
      })
      .catch((e) => {
        // Handle error
      });
  };

  const updateBrandInstagram = () => {
    axios.post("/api/brand/update-brand-instagramHandle", {
      brand_id: user.brand_id,
      instagram_handle: newInstagram,
    })
    .then((ress) => {
      if (ress.data.updated) {
          toast.success("Instagram Handle is updated");
          fetchProfile();
      } else if (!ress.data.success) {
          toast.success("Update failed");
      }
    })
    .catch((e) => {
      // Handle error
    });
};

  const updateBrandCategory = () => {
      axios.post("/api/brand/update-brand-category", {
        brand_id: user.brand_id,
        newBrandCategory: newCategory,
      })
      .then((ress) => {
        if (ress.data.updated) {
            toast.success("Category is updated");
            fetchProfile();
        } else if (!ress.data.success) {
            toast.success("Update failed");
        }
      })
      .catch((e) => {
        // Handle error
      });
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);


    if(!originalPassword || !newPassword){
        setIsLoading(false);
        toast.warning("Enter valid password");
      }


      else {


      await axios.post("/api/brand/change-password",
        { userId: user.brand_id, password : originalPassword, newPassword : newPassword },
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



  return (
    <>

    {loading ? (<CircularProgress />) : (
    <>
    <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={8}>
    <div>
      {/* 1st Line: Profile Photo */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        {logo !== "" || logo !== null ? (<Avatar src={logo} alt="Profile Avatar"  style={{height: '80px', width: '80px'}}/>):
        (<Avatar alt="Profile Avatar"  style={{height: '80px', width: '80px'}}>Brand</Avatar>)}
        
        <div style={{ marginLeft: '20px' }}>
          <Typography variant="h6">Upload brand logo</Typography>
          <Typography variant="body2">This helps influencers identify your brand</Typography>
        </div>
                

            <Button variant="contained" color="secondary" style={{ marginLeft: 'auto' }} onClick={openFileExplorer}>
                        Upload Logo
                        </Button>
                        {/* Hidden file input element */}
                        <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={updateLogo}
                        />

                </div>

      {/* 2nd Line: Name */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Brand Name
                    </Typography>
                    <Typography variant="body1">
                    {brandName}
                    </Typography>
                </div>
                <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
                    Edit
                </Button>
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />


      {/* 3rd Line: Email */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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

      {/* 4th Line: Category */}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Category
                    </Typography>
                    <Typography variant="body1">
                    {category}
                    </Typography>
                </div>
                <Button variant="outlined" color="primary" onClick={handleOpenCategoryDialog}>
                    Change Category
                </Button>
        </div>
                <hr style={{ color: 'grey', border: 'none', height: '1px', backgroundColor: 'grey' }} />

              
      {/* 6th Line: Password */}
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

  {/* 5th Line: Instagram Handle */}

  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
                    Instagram Handle
                    </Typography>
                    <Typography variant="body1">
                    {handle}
                    </Typography>
                </div>
                <Button variant="outlined" color="primary" onClick={handleOpenInstagramDialog}>
                    Change Handle
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


{/* {name dialogue starts} */}

    {brandName && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogContent>
            <TextField type='text' id="brandName" onChange={(e)=>{setNewName(e.target.value)}} margin='normal' variant='outlined' label='Enter Brand Name'></TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateBrandName();
                  handleCloseDialog();
                }}
                color="success"
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}
{/* {name dialogue ends} */}


{/* {instagram dialogue starts} */}

{ (handle || handle === '') && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isInstagramDialogOpen}
            onClose={handleInstagramCloseDialog}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogContent>
            <TextField type='text' id="instagramHandle" onChange={(e)=>{setNewInstagram(e.target.value)}} margin='normal' variant='outlined' label='Enter Instagram Handle'></TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleInstagramCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateBrandInstagram();
                  handleInstagramCloseDialog();
                }}
                color="success"
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}
{/* {instagram dialogue ends} */}



{/* {category dialogue starts} */}

{category && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isCategoryDialogOpen}
            onClose={handleCloseCategoryDialog}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogContent>
        <Select labelId="category-label" id="category-select" value={newCategory} 
         placeholder="Search aasa dad" onChange={(e)=>{setNewCategory(e.target.value)}} >
        <MenuItem value="Select Category" disabled><em>Select Category</em></MenuItem>
        <MenuItem value="Art and Design">Art and Design</MenuItem>
        <MenuItem value="Automotive">Automotive</MenuItem>
        <MenuItem value="Banking and Finance">Banking | Finance</MenuItem>
        <MenuItem value="Beauty and Cosmetics">Beauty & Cosmetics</MenuItem>
        <MenuItem value="Education and E-learning">Education & E-learning</MenuItem>
        <MenuItem value="Entertainment and Media">Entertainment & Media</MenuItem>
        <MenuItem value="Fashion">Fashion</MenuItem>
        <MenuItem value="Fitness and Gym">Fitness & Gym</MenuItem>
        <MenuItem value="Gaming">Gaming</MenuItem>
        <MenuItem value="Groceries">Groceries</MenuItem>
        <MenuItem value="Health and Wellness">Health & Wellness</MenuItem>
        <MenuItem value="Home and Decor">Home & Decor</MenuItem>
        <MenuItem value="Kitchen and Cooking">Kitchen | Cooking</MenuItem>
        <MenuItem value="Lifestyle">Lifestyle</MenuItem>
        <MenuItem value="Outdoor and Adventure">Outdoor & Adventure</MenuItem>
        <MenuItem value="Pets and Animals">Pets & Animals</MenuItem>
        <MenuItem value="Technology and Electronics">Technology & Electronics</MenuItem>
        <MenuItem value="Travel and Tourism">Travel & Tourism</MenuItem>
        {/* Add more MenuItem components for additional categories */}
      </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCategoryDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateBrandCategory();
                  handleCloseCategoryDialog();
                }}
                color="success"
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}
{/* {category dialogue ends} */}
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
                id="password"
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
                id="password"
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
