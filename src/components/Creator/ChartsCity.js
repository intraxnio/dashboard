import React, { useState, useEffect} from 'react'
import { Column } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";




function ChartsCountry() {

  const user = useSelector(state => state.creatorUser);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setTimeout(()=>{

      axios.post("http://localhost:8000/api/v1/creator/creator-audience-cities", {
      userId: user.creator_id,
    }).then(ress=>{

        setData(ress.data.cities);
        setLoading(false);

    }).catch(e=>{

    })

    }, 1000);

  }, []);



 const config = {
    // the data
    data,
    // width and height of the graph
    // width: 800,
    height: 350,
    // autofit option
    autoFit: false,
    // field values
    xField: 'city',
    yField: 'Followers',
    seriesField: 'city',
    // isPercent: true,
    isStack: true,
    // labels
    label: {
      position: 'middle',
      content: (item) => {
        return item.Followers.toFixed(0);
      },
      style: {
        fill: 'white',
        stroke: '#2593fc',
        opacity: 1,
      },
    },

    xAxis: false

  };

  return (
    <>
{loading ? (<CircularProgress />) : (<Column {...config} />)}
</>);
  
}

export default ChartsCountry;



