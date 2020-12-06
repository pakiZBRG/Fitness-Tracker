const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[d.getMonth() - 1]
const currentYear = d.getFullYear();
const getDaysInMonth = (month,year) => new Date(year, month, 0).getDate();
$('#month').append(`Overview of ${currentMonth} ${currentYear}`);

const types = document.getElementById('types');
const records = document.getElementById('records');

let doneByMonth = [];
let allWorkouts = [];
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
workouts.map(workout => {
    // Filter done workouts by month
    allWorkouts.push(workout);
    if(currentMonth.includes(workout.exercises[0].date.split(' ')[2]) && workout.exercises){
        workout.exercises.map(a => doneByMonth.push(a));
    }
});

// Get all done exercises and sum their reps
var counts = [];
let unique = [...new Set(doneByMonth.map(a => a.name))]
unique.map(i => counts.push({"name": i, "reps": []}))
counts.map(i => doneByMonth.map(a => a.name === i.name && i.reps.push({"num": parseInt(a.reps), "date": a.date})));
//Sort by date ascending
counts.map(count => count.reps.sort((a, b) => parseInt(b.date.split(' ')[1]) - parseInt(a.date.split(' ')[1])));
counts.map(single => {
    types.innerHTML += `
        <div class='workout-log'>
            <h3>${single.name} - ${single.reps.reduce((a, b) => a+b.num, 0)}</h3>
            ${single.reps.map(a => `<p>${a.date.substr(5, 11)} - ${a.num}</p>`).join('')}
        </div>
    `
});

//Get all days I have worked for each workout
const days = [];
unique.map(single => {
    counts.map(count => count.name === single && count.reps.map(a => days.push(parseInt(a.date.split(' ')[1]))));
    return days.sort((a, b) => a-b)
});

console.log(allWorkouts);

const t = []
counts.map(count => {
    const singleData = []
    count.reps.map(a => singleData.push({ "y": a.num, "x": parseInt(a.date.split(' ')[1])}));
    const data = {
        name: count.name,
        connectNullData: true,
        nullDataLineDashType: "solid",
        fillOpacity: .15,
        type: "area",
        yValueFormatString: "### reps",
        showInLegend: true,
        dataPoints: singleData.map(print => print)
    }
    t.push(data)
})

const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    animationDuration: 1200,
    theme: 'light2',
    title:{
        text: "Overview"
    },
    axisX: {
        title: "Date",
        interval: 1,
        gridThickness: 1,
        labelFontStyle: 'italic',
        gridColor: '#dcdcdc'
    },
    axisY: {
        title: "Number of reps",
        gridColor: '#dcdcdc',
        tickThickness: 1,
        gridThickness: 1,
        labelFontWeight: "bolder",
        labelFontSize: 16,
        tickLength: 0
    },
    legend:{
        cursor: "pointer",
        fontSize: 16
    },
    toolTip:{
        shared: true
    },
    data: t.map(exercise => exercise)
});

chart.render();

// Getting the record of each exercise
let singleRecord = [];
counts.map(a => singleRecord.push({"name": a.name, "reps": a.reps.map(a => a.num)}));
let max = [];
singleRecord.map(a => max.push({"name": a.name, "max": Math.max(...a.reps)}))
console.log(counts)

max.map(single => {
    records.innerHTML += `
        <div>
            ${single.name} ${single.max}
        </div>
    `
})