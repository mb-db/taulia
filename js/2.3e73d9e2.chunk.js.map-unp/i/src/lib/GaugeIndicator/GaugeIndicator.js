import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAnimation, easeFunctions } from '../utils';

const GaugeIndicator = ({
  fillColor,
  value,
  width,
  stroke,
  animationDelay,
}) => {
  const canvasRef = useRef();
  const startAngle = 0.8;
  const endAngle = 2.2;

  const angleAnimation = useAnimation(
    true,
    1500,
    animationDelay,
    easeFunctions.easeOutCubic
  );

  let normalizedValue = value < 0 ? 0 : value;
  normalizedValue = normalizedValue > 100 ? 100 : normalizedValue;

  useEffect(() => {
    const calculatePercentAngle = animation => {
      return (
        startAngle +
        (endAngle - startAngle) * (normalizedValue / 100) * animation
      );
    };

    // background
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width, width);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.beginPath();
    ctx.arc(
      width / 2,
      width / 2,
      width / 2 - stroke,
      startAngle * Math.PI,
      endAngle * Math.PI
    );
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // fill
    ctx.beginPath();
    ctx.arc(
      width / 2,
      width / 2,
      width / 2 - stroke,
      startAngle * Math.PI,
      calculatePercentAngle(angleAnimation) * Math.PI
    );
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';
    ctx.strokeStyle = fillColor;
    ctx.stroke();
  }, [fillColor, normalizedValue, angleAnimation, width, stroke]);

  return (
    <div className="gauge-indicator" style={{ width: `${width}px` }}>
      <canvas width={width} height={width * 0.8} ref={canvasRef} />
      <div style={{ color: fillColor, fontSize: `${width * 1.8}%` }}>
        {Math.round(normalizedValue * angleAnimation)}
        {'%'}
      </div>
    </div>
  );
};

GaugeIndicator.propTypes = {
  fillColor: PropTypes.string,
  value: PropTypes.number,
  width: PropTypes.number,
  stroke: PropTypes.number,
  animationDelay: PropTypes.number,
};

GaugeIndicator.defaultProps = {
  fillColor: 'black',
  value: 0,
  width: 150,
  stroke: 10,
  animationDelay: 0,
};

export default GaugeIndicator;
