import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';


const ClicksDateChart = ({uniqueVisitors, repeatVisitors}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [timeRange, setTimeRange] = useState('last30Days');
  const [selectedDates, setSelectedDates] = useState([null, null]);

  const hexColors = ['#7743DB', '#001B79'];

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    let startDate;
    let endDate;

    switch (timeRange) {
      case 'last7Days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'last30Days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'custom':
        if (selectedDates[0] && selectedDates[1]) {
          startDate = selectedDates[0];
          endDate = new Date(
            selectedDates[1].getFullYear(),
            selectedDates[1].getMonth(),
            selectedDates[1].getDate() + 1
          );
        }
        break;
      default:
        startDate = new Date();
    }

    const filteredUniqueVisitors = uniqueVisitors.filter(
      (visitor) => new Date(visitor.timestamp) >= startDate && (!endDate || new Date(visitor.timestamp) < endDate)
    );

    const filteredRepeatVisitors = repeatVisitors.filter(
      (visitor) => new Date(visitor.timestamp) >= startDate && (!endDate || new Date(visitor.timestamp) < endDate)
    );

    const allDates = [...filteredUniqueVisitors, ...filteredRepeatVisitors].map(
      (visitor) => new Date(visitor.timestamp).toLocaleDateString()
    );

    const uniqueCounts = countOccurrences(
      filteredUniqueVisitors.map((visitor) => new Date(visitor.timestamp).toLocaleDateString())
    );

    const repeatCounts = countOccurrences(
      filteredRepeatVisitors.map((visitor) => new Date(visitor.timestamp).toLocaleDateString())
    );

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [...new Set(allDates)],
        datasets: [
          {
            label: 'Unique Clicks',
            backgroundColor: hexColors[0],
            borderColor: hexColors[0],
            borderWidth: 1,
            data: mapToCounts([...new Set(allDates)], uniqueCounts),
          },
          {
            label: 'Repeat Clicks',
            backgroundColor: hexColors[1],
            borderColor: hexColors[1],
            borderWidth: 1,
            data: mapToCounts([...new Set(allDates)], repeatCounts),
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          x: {
            type: 'category',
            labels: [...new Set(allDates)],
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

  }, [uniqueVisitors, repeatVisitors, timeRange, selectedDates]);

  const handleFilterChange = (event) => {
    setTimeRange(event.target.value);
  };

  const countOccurrences = (dates) =>
    dates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const mapToCounts = (dates, counts) => dates.map((date) => counts[date] || 0);

  return (
      <div id="chart-container">
      <select value={timeRange} onChange={handleFilterChange}>
        <option value="last7Days">Last 7 Days</option>
        <option value="last30Days">Last 30 Days</option>
        <option value="custom">Custom</option>
      </select>
      {timeRange === 'custom' && (
        <Flatpickr
          options={{ mode: 'range', dateFormat: 'Y-m-d' }}
          value={selectedDates}
          onChange={(dates) => setSelectedDates(dates)}
          onFocus={() => setSelectedDates([null, null])} 
        />
      )}
      <canvas ref={chartRef} />

    </div>
  );
};

export default ClicksDateChart;
