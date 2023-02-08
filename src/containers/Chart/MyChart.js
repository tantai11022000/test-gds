import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
function MyChart() {
  const randomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
  const getTopThreePosition = (data) => {
    let length = data.length;
    let allPosition = {};
    data.forEach((item) => {
      if (allPosition[item.Position]) {
        allPosition[item.Position]++;
      } else {
        allPosition[item.Position] = 1;
      }
    });
    let arrayPosition = [];
    for (var position in allPosition) {
      arrayPosition.push({
        name: position,
        value: allPosition[position],
        color: randomColor(),
      });
    }
    arrayPosition.sort(function (a, b) {
      return b.value - a.value;
    });
    data = arrayPosition.slice(0, 3);
    let other = length
    let otherPercen = 100
    data = data.map((item) => {
      let roundPercen = Math.round((item.value / length) * 100 * 100) / 100
      other -= item.value
      otherPercen -= roundPercen
      return {
        ...item,
        value: roundPercen,
      };
    });
    if (other > 0) {
      data.push({
        name: "Others",
        value: Math.round(otherPercen * 100) / 100,
        color: randomColor(),
      });
    }
    return data;
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    let urlEmployee = `http://localhost:8000/employee`;
    fetch(urlEmployee)
      .then((res) => res.json())
      .then((data) => {
        data = getTopThreePosition(data);
        setData(data);
      });
  }, []);
  return (
    <div style={{ marginLeft: "500px", width: "500px", height: "500px" }}>
      <PieChart data={data} />
      {data.length > 0 &&
        data.map((item, index) => {
          return (
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "15px",
                  backgroundColor: `${item.color}`,
                  display: "inline-block",
                }}
              ></div>
              <span style={{ margin: "0px 20px" }}>{item.name}:</span>
              <span>{item.value}%</span>
            </div>
          );
        })}
    </div>
  );
}

export default MyChart;
