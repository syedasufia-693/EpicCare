import React from "react";
import Chart from "react-apexcharts";

const AreaChart = () => {
  const options = {
    chart: {
      type: "area",
      height: 150,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      x: {
        format: "MMM", // Display short month name in tooltip
      },
    },
    fill: {
      opacity: 0.8,
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    colors: ["#00E396"],
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Health Index",
      data: [31, 40, 28, 51, 42, 109, 100, 91, 84, 65, 75, 90],
    },
  ];

  return (
    <div className="p-4 relative">
      <h1 className="absolute text-xs font-semibold top-0 left-0 text-slate-600 z-30">
        Health Index
      </h1>

      <Chart
        options={options}
        series={series}
        type="area"
        height={150}
        width={300}
        style={{ marginTop: "-12px", marginLeft: "-45px" }}
      />
    </div>
  );
};

export default AreaChart;
