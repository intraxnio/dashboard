import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Grid, Box, Typography, Stack, Button, Tooltip } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

export default function CampaignMetricsIndividualPosts({ campaignId }) {
  const user = useSelector((state) => state.brandUser);
  const [postData, setPostData] = useState([]);
  const [totalReach, setTotalReach] = useState("");
  const [totalImpressions, setTotalImpressions] = useState("");
  const [totalPlays, setTotalPlays] = useState("");
  const [totalBudgetSpent, setTotalBudgetSpent] = useState("");
  const [totalInfluencers, setTotalInfluencers] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // const baseUrl = "http://localhost:8000/api";
  const baseUrl = "https://13.234.41.129:8000/api";


  useEffect(() => {
    axios
      .post("/api/brand/completed-campaign-metrics-from-Api", {
        campaignId: campaignId,
      })
      .then((res) => {
        if (res.data.status) {
          axios
            .post("/api/brand/completed-campaign-metrics-table-from-Db", {
              campaignId: campaignId,
            })
            .then((ress) => {
              setPostData(ress.data.data);
              setTotalReach(ress.data.totalReach);
              setTotalImpressions(ress.data.totalImpressions);
              setTotalPlays(ress.data.totalPlays);
              setTotalBudgetSpent(ress.data.totalBudgetSpent);
              setTotalInfluencers(ress.data.totalInfluencers);
              setLoading(false);
            })
            .catch((e1) => {});
        } else {
          console.log("Errrorrrrrrr:::::::::::");
        }
      })
      .catch((e) => {});
  }, []);

  const columns = [];

  if (postData.some((data) => data.id !== undefined)) {
    // If "impressions" field is present in data
    columns.push({ field: "id", headerName: "S.No", width: 50 });
  }

  if (postData.some((data) => data.avatar !== undefined)) {
    // If "impressions" field is present in data
    columns.push({
      field: "avatar",
      headerName: "",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    });
  }

  if (postData.some((data) => data.creatorName !== undefined)) {
    columns.push({
      field: "creatorName",
      headerName: "Instagram Page",
      width: 200,
      renderCell: (params) => (
        <Button
          endIcon={<ArrowRightIcon />}
          onClick={() => window.open(params.row.profile, "_blank")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#C70039",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "none",
          }}
        >
          {params.value}
        </Button>
      ),
    });
  }

  if (postData.some((data) => data.postDetails !== undefined)) {
    // If "impressions" field is present in data
    columns.push({
      field: "postDetails",
      headerName: "Instagram Post",
      width: 180,
      renderCell: (params) => (
        <Button
          onClick={() => window.open(params.value, "_blank")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#1FAB89",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "none",
          }}
        >
          Post Details
        </Button>
      ),
    });
  }

  if (postData.some((data) => data.reach !== undefined)) {
    columns.push({
      field: "reach",
      headerName: (
        <Tooltip
          title={
            <span style={{ fontSize: "14px" }}>
              Total number of unique users who have seen your post. <br />
              It represents the number of individual accounts that your post has
              reached. <br />
              Each user is counted only once, regardless of how many times they
              may have seen your post.
            </span>
          }
          placement="top"
        >
          <span>Reach</span>
        </Tooltip>
      ),
      width: 110,
      renderCell: (params) => `${formatNumber(params.value)}`,
    });
  }

  if (postData.some((data) => data.impressions !== undefined)) {
    // If "impressions" field is present in data
    columns.push({
      field: "impressions",
      headerName: (
        <Tooltip
          title={
            <span style={{ fontSize: "14px" }}>
              Total number of times your post has been displayed on users'
              screens.
              <br />
              Impressions represent the potential reach of your post, indicating
              how many times it was loaded and could potentially be seen by
              users.
            </span>
          }
          placement="top"
        >
          <span>Impressions</span>
        </Tooltip>
      ),
      width: 140,
      renderCell: (params) => `${formatNumber(params.value)}`,
    });
  }

  if (postData.some((data) => data.plays !== undefined)) {
    // If "plays" field is present in data
    columns.push({
      field: "plays",
      headerName: (
        <Tooltip
          title={
            <span style={{ fontSize: "14px" }}>
              Total number of times your post has been displayed on users'
              screens.
              <br />
              Plays represent the potential reach of your post, indicating how
              many times it was played and could potentially be seen by users.
            </span>
          }
          placement="top"
        >
          <span>Plays</span>
        </Tooltip>
      ),
      width: 140,
      renderCell: (params) => `${formatNumber(params.value)}`,
    });
  }

  if (postData.some((data) => data.pricePerPost !== undefined)) {
    // If "impressions" field is present in data
    columns.push({
      field: "pricePerPost",
      headerName: "Price Per Post",
      width: 140,
      renderCell: (params) => `Rs. ${params.value}`,
    });
  }

  if (postData.some((data) => data.pricePerReach !== undefined)) {
    // If "impressions" field is present in data
    columns.push({
      field: "pricePerReach",
      headerName: "Price Per Reach",
      width: 140,
      renderCell: (params) => `Rs. ${params.value}/-`,
    });
  }

  // ... Add other columns as needed

  const rows = postData;

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            sx={{ marginTop: "15px", borderTop: "1", marginBottom: "64px" }}
          >
            <Grid
              item
              xs={6}
              sm={6}
              md={3}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  backgroundColor: "#3E54AC",
                  color: "white",
                  height: "180px",
                  width: "220px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography sx={{ fontSize: "16px" }}>
                  Total Influencers
                </Typography>
                <Typography
                  sx={{
                    fontSize: "50px",
                    textAlign: "center",
                    padding: "20px",
                    color: "orange",
                  }}
                >
                  {totalInfluencers}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    paddingLeft: "5px",
                  }}
                >
                  {/* <NorthOutlinedIcon/> */}
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Participated
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid
              item
              xs={6}
              sm={6}
              md={3}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  backgroundColor: "#3E54AC",
                  color: "white",
                  height: "180px",
                  width: "220px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography sx={{ fontSize: "16px" }}>Total Reach</Typography>
                <Typography
                  sx={{
                    fontSize: "50px",
                    textAlign: "center",
                    padding: "20px",
                    color: "orange",
                  }}
                >
                  {formatNumber(totalReach)}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    paddingLeft: "5px",
                  }}
                >
                  {/* <NorthOutlinedIcon/> */}
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Up to date
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid
              item
              xs={6}
              sm={6}
              md={3}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  backgroundColor: "#3E54AC",
                  color: "white",
                  height: "180px",
                  width: "220px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography sx={{ fontSize: "16px" }}>
                  {postData[0].media_type === "VIDEO"
                    ? "Total Plays"
                    : "Total Impressions"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "50px",
                    textAlign: "center",
                    padding: "20px",
                    color: "orange",
                  }}
                >
                  {" "}
                  {formatNumber(
                    postData[0].media_type === "VIDEO"
                      ? totalPlays
                      : totalImpressions
                  )}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    paddingLeft: "5px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Up to date
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid
              item
              xs={6}
              sm={6}
              md={3}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  backgroundColor: "#3E54AC",
                  color: "white",
                  height: "180px",
                  width: "220px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography sx={{ fontSize: "16px" }}>Budget Spent</Typography>
                <Typography
                  sx={{
                    fontSize: "50px",
                    textAlign: "center",
                    padding: "20px",
                    color: "orange",
                  }}
                >
                  ₹
                  <span style={{ fontSize: "50px", color: "orange" }}>
                    {" "}
                    {formatNumber(totalBudgetSpent)}
                  </span>
                </Typography>

                <Stack direction="row" spacing={1} sx={{ paddingLeft: "5px" }}>
                  <Typography sx={{ fontSize: "12px" }}>
                    {" "}
                    Avg Cost Per Reach: Rs
                    <span style={{ fontSize: "14px", color: "orange" }}>
                      {" "}
                      {formatNumber((totalBudgetSpent / totalReach).toFixed(2))}
                      /-
                    </span>
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <div style={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              sx={{
                "&:focus": {
                  outline: "none", // Remove the red border on focus
                },
              }}
              isRowSelectable={(params) => {
                return false; // Disable selection for all rows
              }}
              onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection.selectionModel);
              }}
              selectionModel={selectedRows}
              pageSizeOptions={[10, 20]}
              // checkboxSelection
            />
          </div>
        </>
      )}
    </>
  );
}
