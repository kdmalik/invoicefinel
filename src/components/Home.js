import { Chart } from "chart.js/auto";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";

export const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [recentData,setRecentData] = useState ([])
  const chartRef = useRef(null);

  useEffect(() => {
    getData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const getData = async () => {
    const q = query(
      collection(db, "invoices"),
      where("uid", "==", localStorage.getItem("uid"))
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    setInvoices(data);
    setRecentData(data.slice(0,6))
    getOverAllTotal(data);
    getMonthTotal(data);
    const chartData = monthWiseCollaction(data);
    createChart(chartData);
  };

  const getOverAllTotal = (invoiceList) => {
    let t = 0;
    invoiceList.forEach((data) => {
      t += data.grandTotal;
    });
    setTotal(t);
  };

  const getMonthTotal = (invoiceList) => {
    let Month = 0;
    invoiceList.forEach((data) => {
      if (
        new Date(data.date.seconds * 1000).getMonth() === new Date().getMonth()
      ) {
        Month += data.grandTotal;
      }
    });
    setTotalMonthCollection(Month);
  };

  const monthWiseCollaction = (data) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    data.forEach((d) => {
      const invoiceDate = d.date;

      if (invoiceDate && invoiceDate.seconds && !isNaN(d.grandTotal)) {
        const dateObj = new Date(invoiceDate.seconds * 1000);
        const month = dateObj.toLocaleDateString("default", { month: "long" });
        const year = dateObj.getFullYear();

        if (year === new Date().getFullYear()) {
          chartData[month] += d.grandTotal || 0;
        }
      } else {
        console.log("Invalid date or grandTotal for document:", d.id);
      }
    });

    return chartData;
  };

  const createChart = (chartData) => {
    const ctx = document.getElementById("myChart");
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "Month wise Collection",
            data: Object.values(chartData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div>
      <div className="home-first-row">
        <div className="home-box box-1">
          <h1>Rs {total}</h1>
          <p>Overall</p>
        </div>
        <div className="home-box box-2">
          <h1>{invoices.length}</h1>
          <p>Invoices</p>
        </div>
        <div className="home-box box-3">
          <h1>Rs {totalMonthCollection}</h1>
          <p>This Month</p>
        </div>
      </div>
      <div className="home-second-row">
        <div className="chart-box">
          <canvas id="myChart"></canvas>
        </div>
        <div className="recent-invoice-list">
          <h1>Recent Invoice List</h1>
          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
         </div>
         {
         invoices.slice(0,6).map(data =>(
              <div>
                 <p>{data.billedTo.name}</p>
            <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
            <p>{data.grandTotal}</p>
              </div>
         ))
         }
        </div>
      </div>
    </div>
  );
};
