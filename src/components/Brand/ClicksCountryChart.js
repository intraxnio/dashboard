import React, { useEffect, useMemo } from 'react';
import * as echarts from 'echarts';

const ClicksCountryChart = ({ uniqueVisitors, repeatVisitors, startDate, endDate }) => {
 

  const countOccurrences = (arr) =>
  arr.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});


  useEffect(() => {
    // Initialize ECharts instance
    var chartDom = document.getElementById('countryChart');
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
    const allCountries = allVisitors.map((visitor) => visitor.country);

    
    // Count occurrences of cities
    const countryCounts = countOccurrences(allCountries);

    const totalClicks = Object.values(countryCounts).reduce((acc, count) => acc + count, 0);

    
    // Sort the cities by count in descending order
    const sortedCountries = Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]);

    
    // Take only the top 5 cities
    const top5Countries = sortedCountries.slice(0, 5);

    const dataNames = top5Countries.map((country) => country);
    const dataValues = top5Countries.map((country) => countryCounts[country] || 0);

    const dynamicColors = ['#5800FF', '#916DD5', '#393646', '#42855B', '#87C0CD'];


  
    
    option = {
      title: {
        text: 'Top 5 Countries (total clicks)',
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
            // You can customize the format of the labels here
            // For example, split the name into two lines
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

  return <div id="countryChart" style={{ width: '100%', height: '400px' }} />;

};

export default ClicksCountryChart;
