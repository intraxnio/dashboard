import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';



function GenderChart(){
  
const [userId, setUserId] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [followers, setFollowers] = useState('');
const [posts, setPosts] = useState('');
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);


const makeFirstRequest = () => {
  return axios.get("http://localhost:8000/api/v1/creator/getCreator", {
    withCredentials: true,
  });
};

const makeSecondRequest = (id) => {
  axios.post("http://localhost:8000/api/v1/creator/creator-audience-gender", {
    userId: id,
  }).then(ress=>{

      setData(ress.data.gender_percentage);
      // setPosts(ress.data.data.media_count);
      console.log('Gender:::::::', ress.data.gender_percentage);

  }).catch(e=>{

  })
};

useEffect(() => {
  setTimeout(()=>{
    const fetchData = async () => {
      try {
        const firstResponse = await makeFirstRequest();
        console.log('First Response', firstResponse);
        if (firstResponse.data.data == null) {
          setIsLoggedIn(false);
        } else {
          setUserId(firstResponse.data.data);
          setIsLoggedIn(true);
  
          const secondResponse = await makeSecondRequest(
            firstResponse.data.data
          );

          setLoading(false);
  
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();

  }, 1000)

}, []);

const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,

    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };


  return (
    <>
{loading ? (<CircularProgress />) : (<Pie {...config} />)}
</>);
}

export default GenderChart;
