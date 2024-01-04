import React, { useEffect, useMemo } from 'react';
import * as echarts from 'echarts';

const ClicksDateChart = ({uniqueVisitors, repeatVisitors, startDate, endDate}) => {


  const countOccurrences = (arr) =>
  arr.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});



  const filteredUniqueVisitors = uniqueVisitors.filter(
    (visitor) => new Date(visitor.timestamp) >= startDate && (!endDate || new Date(visitor.timestamp) < endDate)
  );

  const filteredRepeatVisitors = repeatVisitors.filter(
    (visitor) => new Date(visitor.timestamp) >= startDate && (!endDate || new Date(visitor.timestamp) < endDate)
  );

 
  const uniqueCounts = useMemo(
    () => countOccurrences(filteredUniqueVisitors.map((visitor) => new Date(visitor.timestamp).toLocaleDateString())),
    [filteredUniqueVisitors]
  );

  const repeatCounts = useMemo(
    () => countOccurrences(filteredRepeatVisitors.map((visitor) => new Date(visitor.timestamp).toLocaleDateString())),
    [filteredRepeatVisitors]
  );

  

  useEffect(() => {
    // Initialize ECharts instance
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

// Combine unique and repeat counts to get all unique dates
const allDatesSet = new Set([...Object.keys(uniqueCounts), ...Object.keys(repeatCounts)]);
const allDates = Array.from(allDatesSet).sort((a, b) => new Date(a) - new Date(b));

    const totalClicksData = allDates.map((date) => (repeatCounts[date] || 0) + (uniqueCounts[date] || 0));
    const uniqueClicksData = allDates.map((date) => uniqueCounts[date] || 0);


    // ECharts option
    const option = {
      // title: {
      //   text: 'Stacked Area Chart'
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#008170'
          }
        }
      },
      legend: {
        data: ['Total Clicks', 'Unique Clicks']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: allDates
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Total Clicks',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: {
            color: '#FF2E63',
            opacity: 1.0,
            // color: 'rgba(82, 120, 83, 1.0)'
          },
          emphasis: {
            focus: 'series'
          },
          data: totalClicksData
        },

        {
          name: 'Unique Clicks',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: {
            color: '#F4CE14',
            opacity: 1.0,
            // color: 'rgba(82, 120, 83, 1.0)'
          },
          emphasis: {
            focus: 'series'
          },
          data: uniqueClicksData
        },
      ]
    };

    // Set the option
    myChart.setOption(option);

    // Cleanup when the component is unmounted
    return () => {
      myChart.dispose();
    };
  }, [uniqueCounts, repeatCounts]); // Empty dependency array to ensure the effect runs only once

  return <div id="main" style={{ width: '100%', height: '400px' }} />;
};

export default ClicksDateChart;
