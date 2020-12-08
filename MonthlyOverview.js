const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[d.getMonth()];
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
    workout.exercises.map(a => allWorkouts.push(a));
    if(currentMonth.includes(workout.exercises[0].date.split(' ')[2]) && workout.exercises){
        workout.exercises.map(a => doneByMonth.push(a));
    }
});

// Get all done exercises (by month and overall) and sum their reps
let monthlyCounts = [];
let overallCounts = [];
let monthlyUinque = [...new Set(doneByMonth.map(a => a.name))];
let overallUnique = [...new Set(allWorkouts.map(a => a.name))]
monthlyUinque.map(i => monthlyCounts.push({"name": i, "reps": []}))
overallUnique.map(i => overallCounts.push({"name": i, "reps": []}))
monthlyCounts.map(i => doneByMonth.map(a => a.name === i.name && i.reps.push({"num": parseInt(a.reps), "date": a.date})));
overallCounts.map(i => allWorkouts.map(a => a.name === i.name && i.reps.push({"num": parseInt(a.reps), "date": a.date})));

//Sort by date ascending
monthlyCounts.map(count => count.reps.sort((a, b) => parseInt(b.date.split(' ')[1]) - parseInt(a.date.split(' ')[1])));
monthlyCounts.map(single => {
    types.innerHTML += `
        <div class='workout-log'>
            <h3>${single.name} - ${single.reps.reduce((a, b) => a+b.num, 0)}</h3>
            ${single.reps.map(a => `<p>${a.date.substr(5, 11)} - ${a.num}</p>`).join('')}
        </div>
    `
});

//Get all days I have worked for each workout
const days = [];
monthlyUinque.map(single => {
    monthlyCounts.map(count => count.name === single && count.reps.map(a => days.push(parseInt(a.date.split(' ')[1]))));
    return days.sort((a, b) => a-b)
});

const t = []
monthlyCounts.map(count => {
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
});
// console.log(t)

const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    animationDuration: 1200,
    theme: 'light2',
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
// Get Chart for every exercises
$('.workout-log').on('click', function(){
    let displayWorkout = [];
    for (const [key, value] of Object.entries(this.childNodes)) {
        overallCounts.map(count => {
            if(value.tagName === "H3" && count.name === value.innerHTML.split(' - ')[0])
                displayWorkout.push(count)
        });
    }

    const y = [];
    const singleData = [];
    displayWorkout.map(workout => {
        workout.reps.map(a => singleData.push({ "y": a.num, "x": parseInt(a.date.split(' ')[1])}));
        const data = {
            name: workout.name,
            connectNullData: true,
            nullDataLineDashType: "solid",
            fillOpacity: .15,
            type: "area",
            yValueFormatString: "### reps",
            showInLegend: true,
            dataPoints: singleData.map(print => print)
        }
        y.push(data)
    });
    
    const chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        animationDuration: 1200,
        theme: 'light2',
        title: {
            text: y[0].name
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
        data: y.map(exercise => exercise)
    });
    chart2.render();
});


// Getting the record of each exercise
let singleRecord = [];
overallCounts.map(a => singleRecord.push({"name": a.name, "reps": a.reps.map(a => a.num)}));
let max = [];
singleRecord.map(a => max.push({"name": a.name, "max": Math.max(...a.reps)}))

max.map(single => {
    records.innerHTML += `
        <div>
            ${single.name} ${single.max}
        </div>
    `
})