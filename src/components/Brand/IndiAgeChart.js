import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';



function IndiAgeWiseChart({userId}){

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const baseUrl = "https://13.234.41.129:8000/api";




const makeSecondRequest = (id) => {
  axios.post(baseUrl+ "/brand/creator-age-wise-followers", {
    userId: id,
  }).then(ress=>{


    console.log('Dataaa::::::', ress.data.genderWise);

      setData((ress.data.genderWise.slice().sort((a, b) => b.value - a.value)));


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

  },1000)

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

export default IndiAgeWiseChart;
