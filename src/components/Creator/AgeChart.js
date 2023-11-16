import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";




function AgeWiseChart(){
  
const user = useSelector(state => state.creatorUser);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const baseUrl = "http://13.234.41.129:8000/api";



useEffect(() => {

  setTimeout(()=>{

    axios.post(baseUrl + "/creator/creator-age-wise-followers", {
      userId: user.creator_id,
    }).then(ress=>{
  
        setData(ress.data.genderWise);
        setLoading(false);
  
    }).catch(e=>{
  
    })

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

export default AgeWiseChart;
