const X_MAX = 400;
const Y_MAX = 400;

function generatePoints() {
  return R.range(0, 100).map(_ => ({
    x: rand(0, X_MAX),
    y: rand(0, Y_MAX)
  }));
}

const randomWeights = {
  x: rand(-1, 1),
  y: rand(-1, 1)
};

function rand(high, low) {
  return Math.random() * (high - low) + low;
}

function team(point) {
  return point.x > point.y ? 1 : -1;
}

function train(weights, point, team) {
  const guessResult = guess(weights, point);
  const error = team - guessResult;
  const learning_rate = 0.2;
  return {
    x: weights.x + point.x * error * learning_rate,
    y: weights.y + point.y * error * learning_rate
  };
}

function guess(weights, point) {
  const sum = point.x * weights.x + point.y * weights.y;
  return sum >= 0 ? 1 : -1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const randomPoints = generatePoints();

const examples = generatePoints().map(point => ({
  point,
  team: team(point)
}));
let currentWeights = randomWeights;
for (const ex of examples) {
  currentWeights = train(currentWeights, ex.point, ex.train);
}
let trainedWeigths = currentWeights;

(function() {
  document.addEventListener(
    "DOMContentLoaded",
    function() {
      const xmlns = "http://www.w3.org/2000/svg";
      const svgElem = document.createElementNS(xmlns, "svg");
      svgElem.setAttributeNS(null, "viewBox", "0 0 " + X_MAX + " " + Y_MAX);
      svgElem.setAttributeNS(null, "width", X_MAX);
      svgElem.setAttributeNS(null, "height", Y_MAX);
      svgElem.style.display = "block";
      randomPoints.map(point => {
        var circle = document.createElementNS(xmlns, "circle");
        circle.setAttributeNS(null, "cx", point.x);
        circle.setAttributeNS(null, "cy", point.y);
        circle.setAttributeNS(null, "r", 5);
        circle.setAttributeNS(
          null,
          "fill",
          guess(trainedWeigths, point) === -1 ? "blue" : "red"
        );
        // circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
        svgElem.appendChild(circle);
      });
      const newLine = document.createElementNS(xmlns, "line");
      newLine.setAttribute("id", "line1");
      newLine.setAttribute("x1", "0");
      newLine.setAttribute("y1", 0);
      newLine.setAttribute("x2", X_MAX);
      newLine.setAttribute("y2", Y_MAX);
      newLine.setAttribute("stroke", "orange");
      svgElem.appendChild(newLine);
      document.getElementById("main").appendChild(svgElem);
    },
    false
  );
})();
