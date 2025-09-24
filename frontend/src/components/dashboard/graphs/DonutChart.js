import React from "react";
import Chart from "react-apexcharts";

const DonutChart = () => {
  const labels =["Heart disease", "Diarrhea", "Diabetes"]
  const colors = ["#FF8042", "#0088FE", "#00C49F"]
  const data = [44, 55, 41];

  const options = {
    chart: {
      type: "donut",
      width: 300, // Adjust the width as needed
      height: 300, // Adjust the height as needed
    },
    labels: labels,
    colors: colors,
    legend: {
      position: "bottom", // Change the legend position to bottom
      fontSize: "12px", // Adjust the font size of the legend
      itemMargin: {
        horizontal: 5,
        vertical: 2,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "55%",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "14px",
              color: "#333",
              offsetY: -20,
            },
            value: {
              show: true,
              fontSize: "10px",
              color: "#333",
              offsetY: 16,
              formatter: function (val) {
                return val;
              },
            },
            // total: {
            //   show: true,
            //   showAlways: true,
            //   label: "Total \n 15",
            //   fontSize: "10px",
            //   fontWeight: "bold",
            //   color: "#333",
            // //   formatter: function (w) {
            // //     return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            // //   },
            // },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
      fontSize: "5px",
    },
  };


  return (
    <div style={{ display: "flex", justifyContent: "center",position:'relative' }}>
    <h1 className="absolute text-xs font-semibold top-0 left-0 text-slate-600">Diagnostics</h1>
    <h1 className="absolute text-[10px] font-semibold top-0 right-0 text-slate-600 flex flex-col items-center"><p>Total Patients</p><p className="text-black font-bold text-sm">{data.reduce((p,c)=>p+c,0)}</p></h1>
    
      <Chart
        options={options}
        series={data}
        type="donut"
        width={250}
        height={160}
      />
    </div>
  );
};

export default DonutChart;


