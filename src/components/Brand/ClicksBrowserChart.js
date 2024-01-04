import React, { useEffect, useMemo } from 'react';
import * as echarts from 'echarts';

const BrowserChart = ({ uniqueVisitors, repeatVisitors, startDate, endDate }) => {

  const countOccurrences = (items) =>
    items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

  useEffect(() => {
    var chartDom = document.getElementById('browserChart');
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

      // Count occurrences of each deviceType in the filteredVisitors
      const browserCounts = countOccurrences(allVisitors.map((visitor) => visitor.browser));

    const dynamicColors = ['#53BF9D', '#A760FF', '#4D77FF', '#FF5403', '#87C0CD'];

    

      const labels = Object.keys(browserCounts);
      const data = Object.values(browserCounts);
      
      let dataSet = labels.map((label, index) => ({
        value: data[index],
        name: label
      }));


      option = {
        title: {
          text: 'Browsers',
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
       
        series: [
          {
            name: 'Total Clicks',
            type: 'pie',
            radius: '50%',
            data: dataSet,
             label: {
              show: true, // Show labels
              position: 'outside', // You can customize the position of the labels (e.g., 'inside', 'center', 'outside')
              formatter: '{b}: {d}%' // Customize the format of the labels
              
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
            opacity: 1.0,
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

      myChart.setOption(option);

      // Cleanup when the component is unmounted
      return () => {
        myChart.dispose();
      };

 
  }, [uniqueVisitors, repeatVisitors]);


    return <div id="browserChart" style={{ width: '100%', height: '600px' }} />;
 
};

export default BrowserChart;
