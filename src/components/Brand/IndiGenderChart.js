import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';



function IndiGenderChart({userId}){
  
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);



const makeSecondRequest = (id) => {
  axios.post("http://localhost:8000/api/brand/creator-audience-gender", {
    userId: id,
  }).then(ress=>{

      setData(ress.data.gender_percentage);

  }).catch(e=>{

  })
};

useEffect(() => {
  setTimeout(()=>{
    const fetchData = async () => {
      try {
        // const firstResponse = await makeFirstRequest();
        // console.log('First Response', firstResponse);
        // if (firstResponse.data.data == null) {
        //   setIsLoggedIn(false);
        // } else {
        //   setUserId(firstResponse.data.data);
        //   setIsLoggedIn(true);
  
          const secondResponse = await makeSecondRequest(
            userId
          );

          setLoading(false);
  
        // }
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

    color: ['#219C90', '#FFA1F5', '#D2E0FB'],

  };


  return (
    <>
{loading ? (<CircularProgress />) : (<Pie {...config} />)}
</>);
}

export default IndiGenderChart;
