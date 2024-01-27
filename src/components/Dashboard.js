// Dashboard.js
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './dashboard.css'; // Import the CSS file for styling

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('source'); // Default filter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://blackcoffer-backend-9mgu.onrender.com'); // Replace with your API URL
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData);
        setData(jsonData.slice(0, 1000)); // Take only the first 20 data points
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderChart = (category, containerId) => {
    console.log(`Rendering ${category} chart with data:`, data);

    if (!data || data.length === 0) {
      console.log('Data is not available yet.');
      return;
    }

    // Process data for pie chart
    const pieData = Array.from(d3.rollup(data, v => v.length, d => d[category]).entries());

    // Sort data by percentage in descending order
    pieData.sort((a, b) => b[1] - a[1]);

    // Combine smaller segments into 'Other' segment
    const majorSegments = pieData.slice(0, 5);
    const otherSegments = pieData.slice(5);

    // Calculate the percentage for 'Other' segment
    const otherPercentage = d3.sum(otherSegments, d => d[1]);

    // Combine major segments and 'Other' segment
    const combinedData = [...majorSegments, ['Other', otherPercentage]];

    // Create color scale
    const color = d3.scaleOrdinal().range(d3.schemeCategory10);

    // Set up chart dimensions
    const widthPie = 600;
    const heightPie = 600;
    const radiusPie = Math.min(widthPie, heightPie) / 2;

    // Create SVG container for pie chart
    const svgContainer = d3.select(`#${containerId}`);

    // Remove previous chart
    svgContainer.selectAll('*').remove();

    // Create pie chart layout
    const pie = d3.pie().value(d => d[1]);
    const pieChartData = pie(combinedData);

    // Create SVG container for pie chart
    const svg = svgContainer.append('svg')
      .attr('width', widthPie)
      .attr('height', heightPie)
      .append('g')
      .attr('transform', `translate(${widthPie / 2},${heightPie / 2})`);

    // Create pie chart arcs
    const arcs = svg.selectAll('arc')
      .data(pieChartData)
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Draw slices
    arcs.append('path')
      .attr('class', 'arc')
      .attr('d', d3.arc().innerRadius(0).outerRadius(radiusPie))
      .attr('fill', (d, i) => color(i));

    // Create legend
    const legend = svgContainer.append('div')
      .attr('class', 'legend');

    // Add legend items
    const legendItems = legend.selectAll('.legend-item')
      .data(pieChartData)
      .enter().append('div')
      .attr('class', 'legend-item');

    legendItems.append('div')
      .attr('class', 'legend-color')
      .style('background-color', (d, i) => color(i));

    legendItems.append('div')
      .attr('class', 'legend-label')
      .text(d => d.data[0] !== 'null' ? d.data[0] : null);

    // Create table for pie chart details
    const tableContainer = d3.select(`#${containerId}-table`);
    const table = tableContainer.select('table');
    const tbody = table.select('tbody');

    // Remove previous table rows
    tbody.selectAll('*').remove();

    // Add table rows
    const rows = tbody.selectAll('tr')
      .data(pieChartData)
      .enter()
      .append('tr');

    // Add table data
    rows.append('td').text(d => d.data[0] !== 'null' ? d.data[0] : null);
    rows.append('td').style('background-color', (d, i) => color(i));
    rows.append('td').text(d => `${(d.data[1] / data.length * 100).toFixed(2)}%`);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  useEffect(() => {
    renderChart(selectedFilter, `${selectedFilter}-chart-container`);
  }, [data, selectedFilter]);

  return (
    <div>
      <h1>Data Visualization Dashboard</h1>
      <h3>This is For First 1000+ Data's For Demo</h3>
      <div id="filter-container">
        <label htmlFor="chart-filter">Select Chart:</label>
        <select id="chart-filter" onChange={handleFilterChange} value={selectedFilter}>
          <option value="source">Source</option>
          <option value="sector">Sector</option>
          <option value="topic">Topic</option>
          <option value="region">Region</option>
          <option value="pestle">Pestle</option>
          <option value="likelihood">Likelihood</option>
        </select>
      </div>
      <div id="dashboard-container">
        <div className="chart-section">
          <h2>{selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</h2>
          <div id={`${selectedFilter}-chart-container`} className="chart-container"></div>
          <div id={`${selectedFilter}-chart-container-table`} className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{`${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Name`}</th>
                  <th>Color</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
