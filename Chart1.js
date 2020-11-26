var speedCanvas = document.getElementById("speedChart");

Chart.defaults.global.defaultFontSize = 16;

var dataFirst = {
    label: "Car A",
    data: [0, 59, 75, 20, 20, 55, 40],
    backgroundColor: ['rgba(0, 96, 255, 0.2)'],
    borderColor: ['rgba(0, 96, 255, 1)'],
    borderWidth: 2
  };

var dataSecond = {
    label: "Car B",
    data: [20, 15, 60, 60, 65, 30, 70],
    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
    borderColor: ['rgba(255, 99, 132, 1)'],
    borderWidth: 2
  };

  console.log(dataFirst)

var speedData = {
  labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
  datasets: [dataFirst, dataSecond]
};

var chartOptions = {
  legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    }
  }
};

var lineChart = new Chart(speedCanvas, {
  type: 'line',
  data: speedData,
  options: chartOptions
});