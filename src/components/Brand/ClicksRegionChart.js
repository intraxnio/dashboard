import React, { useEffect, useMemo } from 'react';
import * as echarts from 'echarts';

const ClicksRegionChart = ({ uniqueVisitors, repeatVisitors, startDate, endDate }) => {
 

  const countOccurrences = (arr) =>
  arr.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});


  useEffect(() => {
    // Initialize ECharts instance
    var chartDom = document.getElementById('regionChart');
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
    const allRegions = allVisitors.map((visitor) => visitor.region);
    
    // Count occurrences of cities
    const regionCounts = countOccurrences(allRegions);
    const totalClicks = Object.values(regionCounts).reduce((acc, count) => acc + count, 0);

    // Sort the cities by count in descending order
    const sortedRegions = Object.keys(regionCounts).sort((a, b) => regionCounts[b] - regionCounts[a]);

    
    // Take only the top 5 cities
    const top5Regions = sortedRegions.slice(0, 5);

    const dataNames = top5Regions.map((region) => region);
    const dataValues = top5Regions.map((region) => regionCounts[region] || 0);

    const dynamicColors = ['#1FAB89', '#645CAA', '#FFCE56', '#36A2EB', '#9966FF'];



  
    
    option = {
      title: {
        text: 'Top 5 Regions (total clicks)',
        left: 'center',
        textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: 'black'
        }
    },
    tooltip: {
      trigger: 'item'
    },
      xAxis: {
        type: 'category',
        data: dataNames,
        axisLabel: {
          interval: 0, // Allow all labels to be displayed
          formatter: function (value) {
            const lines = value.split(' ');
            return lines.join('\n');
          },
        },
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total Clicks',
          data: dataValues,
          type: 'bar',
          label: {
            show: true, // Display labels
            position: 'top', // Position of labels (you can customize it)
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

  return <div id="regionChart" style={{ width: '100%', height: '400px' }} />;

};

export default ClicksRegionChart;
