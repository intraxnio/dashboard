import React, { useEffect, useMemo } from 'react';
import * as echarts from 'echarts';

const ClicksCityChart = ({ uniqueVisitors, repeatVisitors, startDate, endDate }) => {
 

  const countOccurrences = (arr) =>
  arr.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});


  useEffect(() => {
    // Initialize ECharts instance
    var chartDom = document.getElementById('cityChart');
    var myChart = echarts.init(chartDom);
    var option;

      const filteredUniqueVisitors = uniqueVisitors.filter(
      (visitor) =>
        new Date(visitor.timestamp) >= startDate && (!endDate || new Date(visitor.timestamp) < endDate)
    );
    
    const filteredRepeatVisitors = repeatVisitors.filter(
      (visitor) =>
        new Date(visitor.timestamp) >= startDate && (!endDate || new Date(visitor.timestamp) < endDate)
    );
    
    // Combine unique and repeat visitors into a single array
    const allVisitors = [...filteredUniqueVisitors, ...filteredRepeatVisitors];
    
    // Get cities from filtered visitors
    const allCities = allVisitors.map((visitor) => visitor.city);
    
    // Count occurrences of cities
    const cityCounts = countOccurrences(allCities);
    const totalClicks = Object.values(cityCounts).reduce((acc, count) => acc + count, 0);

    
    // Sort the cities by count in descending order
    const sortedCities = Object.keys(cityCounts).sort((a, b) => cityCounts[b] - cityCounts[a]);

    console.log('sortedCities', cityCounts);
    
    // Take only the top 5 cities
    const top5Cities = sortedCities.slice(0, 5);

    const dataNames = top5Cities.map((city) => city);
    const dataValues = top5Cities.map((city) => cityCounts[city] || 0);

    const dynamicColors = ['#1FAB89', '#645CAA', '#FFCE56', '#36A2EB', '#9966FF'];


  
    
    option = {

      title: {
        text: 'Top 5 Cities (total clicks)',
        left: 'center',
        textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: 'black'
        }
    },
      
      xAxis: {
        type: 'category',
        data: dataNames
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Total Clicks',
          data: dataValues,
          type: 'bar',
          label: {
            show: true, // Display labels
            position: 'top',
            formatter: function (params) {
              const percentage = (params.value / totalClicks * 100).toFixed(2);
              return `${percentage}%`;
          } 
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            color: function (params) {
              // Set different colors for each bar
              return dynamicColors[params.dataIndex % dynamicColors.length];
            },
          },
        }
      ]
    };
    
    // Set the option
    myChart.setOption(option);

    // Cleanup when the component is unmounted
    return () => {
      myChart.dispose();
    };
  }, [uniqueVisitors, repeatVisitors]); // Empty dependency array to ensure the effect runs only once


  // const handleFilterChange = (event) => {
  //   setTimeRange(event.target.value);
  // };

  return <div id="cityChart" style={{ width: '100%', height: '400px' }} />;

};

export default ClicksCityChart;
