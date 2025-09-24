import React from "react";
import Chart from "react-apexcharts";

const PieChartWithLegend = () => {
  const options = {
    chart: {
      type: "pie",
      height: 300,
    },
    labels: ["Men", "Women", "Children"],
    colors: ["#00E396", "#FFB547", "#008FFB"],
    legend: {
      show: true,
      position: "right",
      offsetY: -15,
      height: 230,
    },
    dataLabels: {
      enabled: true,
      offsetY: 0,
      formatter: (val, opts) => {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return val;
        },
      },
    },
  };

  const series = [40, 30, 30]; // Values in millions

  return (
    <div className="p-4 relative">
      <h1 className="absolute text-xs font-semibold top-0 left-0 text-slate-600">
        Patients
      </h1>

      <Chart
        options={options}
        series={series}
        type="pie"
        height={300}
        className="-mt-3 md:scale-110 md:mt-3"
      />
    </div>
  );
};

export default PieChartWithLegend;
