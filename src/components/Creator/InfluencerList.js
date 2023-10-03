import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  BottomNavigation,
  BottomNavigationAction,
  ButtonGroup,
  Button,
} from "@mui/material";
import sideImage from "../../images/img.jpg";
import SendIcon from "@mui/icons-material/Send";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function InfluencerList() {
  const influencerData = [
    {
      _id: "2345jhgfds3456hgf",
      name: "jeevanpriya",
      handle: "jeevanpriya_reddy",
      followers: "121K",
      country: "India",
      category: "Vlogging",
      price: "400"
    },
    {
      _id: "2345jhgfds34addddvf",
      name: "babysleep",
      handle: "babysleep_solutions",
      followers: "143K",
      country: "India",
      category: "Food Vlogger",
      price: "600"
    },
    {
      _id: "09876jhgfds3456hgf",
      name: "madhu",
      handle: "madhu_0819",
      followers: "69.9K",
      country: "India",
      category: "Lifestyle",
      price: "700"
    },
    {
      _id: "2345jhgfds34kjx87789f",
      name: "bindu krishna",
      handle: "bindu___krishna",
      followers: "55.6K",
      country: "India",
      category: "Baby Care",
      price: "900"
    },
    {
      _id: "2345jhgfds209836hgf",
      name: "srivani naiduuu",
      handle: "srivani_naidu13",
      followers: "105K",
      country: "India",
      category: "Film Industry",
      price: "1000"
    },
    {
      _id: "2345jhgf0987ds3456hgf",
      name: "indian girls travel",
      handle: "indiangirlstravel",
      followers: "618K",
      country: "India",
      category: "Photography",
      price: "1300"
    },
    {
      _id: "2345jhgfd10625s3456hgf",
      name: "Sup Riya",
      handle: "sup_riya1230",
      followers: "9473",
      country: "India",
      category: "Travel",
      price: "1700"
    },
  ];

  const [selectedInflu, setSelectedInflu] = useState([]);

  const handleSelected = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedInflu((pre) => [...pre, value]);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
        <Table aria-label="influencer table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Followers</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Price Per Post</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {influencerData.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <Checkbox value={row._id} onChange={handleSelected}></Checkbox>

                <TableCell sx={{ width: "150px", height: "150px" }}>
                  <img
                    className="img-fluid"
                    src={sideImage}
                    alt="Passion into Profession"
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: "100px" }}>{row.name}</TableCell>
                <TableCell sx={{ maxWidth: "100px" }}>{row.category}</TableCell>
                <TableCell sx={{ maxWidth: "50px" }}>{row.followers}</TableCell>
                <TableCell sx={{ maxWidth: "50px" }}>{row.country}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell><Button>View Profile</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels>
          <ButtonGroup row>
            <Button
              variant="outlined"
              sx={{
                height: "40px",
                alignItems: "center",
              }}
            >
              Selected: {selectedInflu.length}
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                height: "40px",
                alignItems: "center",
              }}
              onClick={handleClickOpen}
            >
              Send Invites
            </Button>

      {/* Dialogue code starts*/}

            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
              >
                Modal title
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Dear [influencers]
                </Typography>
                <Typography gutterBottom>
                We [brand name] would like to collaborate with you for our promotion.
                Our campaign details are enclosed in the invitation and kindly do check and confirm your decision on it.
                </Typography>
                <Typography gutterBottom>
                 Thank you....
                  fringilla.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose}>
                  Send Invitations
                </Button>
              </DialogActions>
            </BootstrapDialog>
      {/* Dialogue code starts*/}

          </ButtonGroup>

        </BottomNavigation>
      </Paper>
    </>
  );
}

export default InfluencerList;
