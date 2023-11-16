import React, { useState, useEffect} from 'react'
import { Column } from '@ant-design/plots';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

// data array

function IndiChartsCountry({userId}) {
  // const [data, setData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [followers, setFollowers] = useState('');
  const [posts, setPosts] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const makeSecondRequest = (id) => {
    axios.post("http://localhost:8000/api/v1/creator/creator-audience-countries", {
      userId: id,
    }).then(ress=>{

        setData(ress.data.countries);
        // setPosts(ress.data.data.media_count);
        // console.log('response:::::::', ress);

    }).catch(e=>{

    })
  };

  useEffect(() => {
    setTimeout(()=>{
      const fetchData = async () => {
        try {
  
            const secondResponse = await makeSecondRequest(
              userId
            );

            setLoading(false);
  
          
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();

    }, 1000)
   
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
    xField: 'country',
    yField: 'Followers',
    seriesField: 'country',
    isStack: true,

    // labels
    label: {
      // position to show the label
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
</>)
 
}

export default IndiChartsCountry;























// console.log('dataFetched::', dataFetched)
// const data=[
//     {
//         country: "India",
//         Followers: 90000
//     },
//     {
//         country: "USA",
//         Followers: 37000
//     },
//     {
//         country: "Australia",
//         Followers: 12000
//     },
//     {
//         country: "England",
//         Followers: 5000
//     },
//     {
//         country: "UK",
//         Followers: 3000
//     },
//     //.... more data
// ]
// configuration object
//  const config = {
//     // the data
//     data,
//     // width and height of the graph
//     // width: 800,
//     height: 400,
//     // autofit option
//     autoFit: false,
//     // field values
//     xField: 'country',
//     yField: 'Followers',
//     seriesField: 'country',
//     isStack: true,

//     // labels
//     label: {
//       // position to show the label
//       position: 'middle',
//       content: (item) => {
//         return item.Followers.toFixed(0);
//       },
//       // style
//       style: {
//         fill: 'white',
//         stroke: '#2593fc',
//         opacity: 1,
//       },
//     },
//   };
// // React component
// export const ChartsCountry=()=>(<Column {...config} />)