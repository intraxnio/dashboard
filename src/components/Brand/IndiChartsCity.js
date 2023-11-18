import React, { useState, useEffect} from 'react'
import { Column } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


// data array

function IndiChartsCity({userId}) {
  // const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [followers, setFollowers] = useState('');
  const [posts, setPosts] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://13.234.41.129:8000/api";




  const makeSecondRequest = (id) => {
    axios.post("/api/brand/creator-audience-cities", {
      userId: id,
    }).then(ress=>{

        setData(ress.data.cities);
        // setPosts(ress.data.data.media_count);
        // console.log('response:::::::', ress);

    }).catch(e=>{

    })
  };

  useEffect(() => {
    setTimeout(()=>{

      const fetchData = async () => {
        try {
        //   const firstResponse = await makeFirstRequest();
        //   console.log('First Response', firstResponse);
        //   if (firstResponse.data.data == null) {
        //     setIsLoggedIn(false);
        //   } else {
        //     setUserId(firstResponse.data.data);
        //     setIsLoggedIn(true);
  
            const secondResponse = await makeSecondRequest(
              userId
            );

            setLoading(false);
  
        //   }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();

    }, 1000);

  }, []);



 const config = {
    // the data
    data,
    // width and height of the graph
    // width: 800,
    height: 400,
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

export default IndiChartsCity;



