const CX = 120;
const CY = 120;
const R = 88;
const DEG_PER_MIN = 6;

const MODE_COLORS = {
  focus: '#e74c3c',
  shortBreak: '#27ae60',
  longBreak: '#27ae60',
};

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function wedgePath(cx, cy, r, sweepDeg) {
  if (sweepDeg <= 0) return '';
  if (sweepDeg >= 360) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }
  const start = polarToCartesian(cx, cy, r, 0);
  const end = polarToCartesian(cx, cy, r, sweepDeg);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function createTick(cx, cy, innerR, outerR, angleDeg) {
  const inner = polarToCartesian(cx, cy, innerR, angleDeg);
  const outer = polarToCartesian(cx, cy, outerR, angleDeg);
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', String(inner.x));
  line.setAttribute('y1', String(inner.y));
  line.setAttribute('x2', String(outer.x));
  line.setAttribute('y2', String(outer.y));
  line.setAttribute('class', 'clock-tick');
  return line;
}

function createNumber(cx, cy, r, minute) {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  const pos = polarToCartesian(cx, cy, r, minute * DEG_PER_MIN);
  text.setAttribute('x', String(pos.x));
  text.setAttribute('y', String(pos.y));
  text.setAttribute('class', 'clock-number');
  text.textContent = String(minute);
  return text;
}

export function createAnalogClock(svgEl) {
  if (!svgEl) {
    throw new Error('Analog clock SVG element not found');
  }

  const ticksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  ticksGroup.setAttribute('class', 'clock-ticks');

  for (let i = 0; i < 60; i++) {
    const isMajor = i % 5 === 0;
    const tick = createTick(CX, CY, isMajor ? R - 14 : R - 8, R - 2, i * DEG_PER_MIN);
    tick.setAttribute('class', isMajor ? 'clock-tick clock-tick--major' : 'clock-tick');
    ticksGroup.appendChild(tick);
  }

  const numbersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  numbersGroup.setAttribute('class', 'clock-numbers');
  for (let m = 0; m < 60; m += 5) {
    numbersGroup.appendChild(createNumber(CX, CY, R - 26, m));
  }

  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow.setAttribute('class', 'clock-arrow');
  arrow.setAttribute(
    'd',
    `M ${CX - 4} ${CY - R + 18} L ${CX} ${CY - R + 10} L ${CX + 4} ${CY - R + 18} Z`
  );

  const wedge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  wedge.setAttribute('class', 'clock-wedge');

  const knob = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  knob.setAttribute('class', 'clock-knob');
  knob.setAttribute('cx', String(CX));
  knob.setAttribute('cy', String(CY));
  knob.setAttribute('r', '16');

  svgEl.appendChild(ticksGroup);
  svgEl.appendChild(wedge);
  svgEl.appendChild(numbersGroup);
  svgEl.appendChild(arrow);
  svgEl.appendChild(knob);

  function update(timeLeft, mode) {
    const minutesLeft = timeLeft / 60;
    const sweepDeg = minutesLeft * DEG_PER_MIN;
    wedge.setAttribute('d', wedgePath(CX, CY, R, sweepDeg));
    wedge.setAttribute('fill', MODE_COLORS[mode] ?? MODE_COLORS.focus);
  }

  return { update };
}
