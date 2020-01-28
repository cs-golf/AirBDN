import React from "react";
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/AirBDN";
var Chart = requires('chart.js')
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("AirBDN");
    var query = { sensor_id: "29002" };
    dbo.collection("corrected_data").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
//Extract P10 values to P10 Array and P2.5 values to P2.5 Array
var myChart = new Chart(ctx,
{
      type: 'line',
    	  data: {
    	    labels: [],/*timestamps_array,*/
    	    datasets: [{
    	      label: 'P10 Values',
    	      backgroundColor: 'rgba(255, 99, 132, 0.8)',
    	      borderColor: 'rgba(255, 99, 132, 1)',
    	      fill: false,
    	      data: []/*P10_array*/
            },
            {
    	      label: 'P2.5 Values',
    	      backgroundColor: 'rgba(54, 162, 235, 0.8)',
    	      borderColor: 'rgba(54, 162, 235, 1)',
    	      fill: false,
    	      data: []/*P2.5_array*/
    	    }]
    	  },
    	  options: {
    	        responsive: true,
    	        title: {
    	            display: true,
    	          text: 'Line Chart'
    	        },
    	    tooltips: {
    	            mode: 'index',
    	            intersect: false,
    	        },
    	        hover: {
    	            mode: 'nearest',
    	            intersect: true
    	        },
    	        scales: {
    	            xAxes: [{
    	                display: true,
    	                scaleLabel: {
    	                    display: true,
    	                    labelString: 'Time'
    	                }
    	            }],
    	            yAxes: [{
    	                display: true,
    	                scaleLabel: {
    	                    display: true,
    	                    labelString: 'Value'
    	                }
    	            }]
    	        }
    	  }
        }
);