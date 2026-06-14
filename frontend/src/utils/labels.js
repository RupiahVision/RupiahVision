const rupiahLabels = {
  1000: "Rp1.000",
  2000: "Rp2.000",
  5000: "Rp5.000",
  10000: "Rp10.000",
  20000: "Rp20.000",
  50000: "Rp50.000",
  100000: "Rp100.000",
};

export function formatPredictionLabel(label) {
  if (label === "bukanuang") {
    return "bukan uang kertas";
  }

  return rupiahLabels[label] || label;
}

export function getPredictionSubject(label) {
  if (label === "bukanuang") {
    return "bukan uang kertas";
  }

  return `uang kertas ${formatPredictionLabel(label)}`;
}
