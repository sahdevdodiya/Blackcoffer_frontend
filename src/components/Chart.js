import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Chart = ({ data }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const svg = d3.select(chartContainerRef.current);
      svg.selectAll('*').remove(); // Clear previous chart

      // Set up chart dimensions
      const width = 400;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      // Create scales
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height - margin.bottom, margin.top]);

      // Create bars
      svg.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('x', d => xScale(d.label))
        .attr('y', d => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d.value))
        .attr('fill', 'steelblue');

      // Create axes
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));
    }
  }, [data]);

  return (
    <div>
      <h2>Chart</h2>
      <svg ref={chartContainerRef} width={400} height={200}></svg>
    </div>
  );
};

export default Chart;
