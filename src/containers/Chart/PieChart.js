import React, { useEffect, useRef } from "react";

const PieChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    data.forEach((item,index) => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.arc(
        100,
        100,
        100,
        startAngle,
        startAngle + (item.value / total) * 2 * Math.PI
      );
      ctx.lineTo(100, 100);
      ctx.fill();
      startAngle += (item.value / total) * 2 * Math.PI;
    });
  }, [data]);

  return <canvas style={{marginBottom: "50px"}} ref={canvasRef} width={200} height={200} />;
};

export default PieChart;
