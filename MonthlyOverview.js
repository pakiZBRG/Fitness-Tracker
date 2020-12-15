const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[d.getMonth()];
const currentYear = d.getFullYear();
const getDaysInMonth = (month,year) => new Date(year, month, 0).getDate();
$('#month').append(`Overview of ${currentMonth} ${currentYear}`);

let doneByMonth = [];
let allWorkouts = [];
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
workouts.map(workout => {
    // Filter done workouts by month
    workout.exercises.map(a => allWorkouts.push(a));
    if(currentMonth.includes(workout.exercises[0].date.split(' ')[2]) && workout.exercises)
        workout.exercises.map(a => doneByMonth.push(a));
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
            <div class='workout-log--row'>
                <div>
                    <label for='name'>Name</label>
                    <h3 id='name name--workout'>${single.name}</h3>
                </div>
                <div style='align-items: end'>
                    <label for='total'>Total</label>
                    <span id='total'>${single.reps.reduce((a, b) => a+b.num, 0)}</span>
                </div>
            </div>
            <div class='workout-log--column'>
                <div>
                    <label for='date'>Date</label>
                    <label for='reps'>Reps</label>
                </div>
                ${single.reps.map(a => `
                    <div>
                        <span id='date'>${a.date.substr(5, 11)}</span>
                        <span id='reps'>${a.num}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `
});

//Get all days I have worked for each workout
const days = [];
monthlyUinque.map(single => {
    monthlyCounts.map(count => count.name === single && count.reps.map(a => days.push(parseInt(a.date.split(' ')[1]))));
    return days.sort((a, b) => a-b)
});


const workoutData = []
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
    workoutData.push(data)
});

const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    animationDuration: 1200,
    theme: "dark2",
    backgroundColor: "transparent",
    axisX: {
        title: "Date",
        interval: 1,
        gridThickness: 1,
        labelFontStyle: 'italic',
        gridColor: '#dcdcdc'
    },
    axisY: {
        title: "Number of reps",
        padding: 2,
        gridColor: '#dcdcdc',
        tickThickness: 1,
        gridThickness: 1,
        labelFontWeight: "bolder",
        labelFontSize: 16,
        tickLength: 0
    },
    legend:{
        cursor: "pointer",
        fontSize: 16,
        itemclick: function (e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
    },
    toolTip:{
        shared: true
    },
    data: workoutData.map(exercise => exercise)
});

chart.render();

$('.workout-log').on('click', function(e){
    // Get info for clicked exercises
    let displayWorkout = [];
    // console.log(e.target.children[0].children[0].children[1].tagName)
    console.log(e.target)
    for (const [key, value] of Object.entries(this.childNodes)) {
        overallCounts.map(count => {
            if(value.tagName === "H3" && count.name === value.innerHTML.split(' - ')[0])
                displayWorkout.push(count)
        });
    }

    console.log(displayWorkout)

   //Create an Object for every month in year
    const exerciseByMonths = []
    monthNames.map(month => exerciseByMonths.push({"name": month, "reps": []}))

    // Push workouts with the same month as the array name
    displayWorkout.map(workout => workout.reps.map(rep => exerciseByMonths.map(month => {
            if(month.name.includes(rep.date.split(' ')[2]))
                month.reps.push(rep);
        })
    ));

    //Sort by reps and display all instance of the exercise
    const singleWorkout = document.getElementById('displaySingleWorkout');
    exerciseByMonths.map(workout => workout.reps.sort((a, b) => b.num - a.num));
    singleWorkout.innerHTML = `<h3>${e.currentTarget.children[0].textContent.split(' - ')[0]}</h3>`
    exerciseByMonths.map(workout => {
        if(workout.reps.length > 0)
            singleWorkout.innerHTML += `
                <div>
                    <h2>${workout.name}</h2>
                    ${workout.reps.map(rep => `<p>${rep.num} ${rep.date}</p>`).join('')}
                </div>
            `
    });

    //Color top 3 workouts
    const top3 = [...singleWorkout.children]
    top3.map(single => {
        single.children[1] && single.children[1].classList.add('green')
        single.children[2] && single.children[2].classList.add('yellow')
        single.children[3] && single.children[3].classList.add('red')
    });
});