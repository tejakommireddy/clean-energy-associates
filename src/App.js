import React, { Component } from 'react';
import ReactToExcel from 'react-html-table-to-excel';
import './App.css';
import CanvasJSReact from './assets/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const CanvasJS = CanvasJSReact.CanvasJS;

class App extends Component {

  constructor(props) {
    super(props);
    this.state =
    {
      items: [],
      isLoaded: false,
    }
  }

  componentDidMount() {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo')
      .then(res => res.json())
      .then(json => {
        const timeSeries = json["Time Series (Daily)"];
        const items = Object.values(timeSeries);
        const chartData = Object.keys(timeSeries).map((timeSerie) => ({
          x: new Date(timeSerie),
          y: Number(timeSeries[timeSerie]["1. open"])
        }))

        const chartData1 = Object.keys(timeSeries).map((timeSerie) => ({
          x: new Date(timeSerie),
          y: Number(timeSeries[timeSerie]["2. high"])
        }))

        const chartData2 = Object.keys(timeSeries).map((timeSerie) => ({
          x: new Date(timeSerie),
          y: Number(timeSeries[timeSerie]["3. low"])
        }))

        const chartData3 = Object.keys(timeSeries).map((timeSerie) => ({
          x: new Date(timeSerie),
          y: Number(timeSeries[timeSerie]["4. close"])
        }))


        this.setState({
          isLoaded: true,
          items, 
          chartData,
          chartData1,
          chartData2,
          chartData3
        })
      });
    
      
  }

  render() {
    var { isLoaded, items,chartData,chartData1,chartData2,chartData3 } = this.state;
    const options = {
			animationEnabled: true,
			title:{
				text: ""
			},
			axisX: {
				valueFormatString: "MM-DD-YYYY"
			},
			axisY: {
				title: "Sales (in USD)",
				prefix: "$",
				includeZero: false
			},
			data: [{
				yValueFormatString: "$#,###",
				xValueFormatString: "YYYY",
				type: "spline",
        dataPoints: chartData
      },
      {
				yValueFormatString: "$#,###",
				xValueFormatString: "YYYY",
				type: "spline",
        dataPoints: chartData1
      },
      {
				yValueFormatString: "$#,###",
				xValueFormatString: "YYYY",
				type: "spline",
        dataPoints: chartData2
      },
      {
				yValueFormatString: "$#,###",
				xValueFormatString: "YYYY",
				type: "spline",
        dataPoints: chartData3
      }
    ]}
    if (!isLoaded || !items || items.length === 0) {
      return <div>Loading...</div>;
    }
    else {
      return (
        <div className="App">
          <table border="1" id="table-to-xls">
            <thread>
              <tr>
                <th>date</th>
                <th>open</th>
                <th>high</th>
                <th>low</th>
                <th>close</th>
              </tr>
            </thread>
            <tbody>
              {items.map(item => (
                <tr>
                  <td>{item["1. open"]}</td>
                  <td>{item["2. high"]}</td>
                  <td>{item["3. low"]}</td>
                  <td>{item["4. close"]}</td>
                  <td>{item["5. volume"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactToExcel
            className="btn"
            table="table-to-xls"
            filename="excelFile"
            sheet="sheet 1"
            buttonText="EXPORT"
          >
          </ReactToExcel>
          <CanvasJSChart options = {options} 
			/>
        </div>
      );
    }
  }
}

export default App;
