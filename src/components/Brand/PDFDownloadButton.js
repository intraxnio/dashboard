import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ClicksDateChart from './ClicksDateChart';

const PDFDownloadButton = ({ chartData }) => {
  const handleDownload = () => {
    const chartContainer = document.getElementById('chart-container');

    html2canvas(chartContainer).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 120);
      pdf.save('link_metrics_report.pdf');
    });
  };

  return (
    <div>
      <ClicksDateChart
        uniqueVisitors={chartData.uniqueVisitors}
        repeatVisitors={chartData.repeatVisitors}
        onDataAvailable={() => {}}
      />
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
};

export default PDFDownloadButton;
