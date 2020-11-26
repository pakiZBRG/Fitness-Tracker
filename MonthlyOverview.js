const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[d.getMonth()]
const currentYear = d.getFullYear();
const getDaysInMonth = (month,year) => new Date(year, month, 0).getDate();
$('#month').append(`Overview of ${currentMonth} ${currentYear}`);

const types = document.getElementById('types');

let doneByMonth = []
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
workouts.map(workout => {
    // Filter done workouts by month
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
counts.map(count => count.reps.sort((a, b) => parseInt(a.date.split(' ')[1]) - parseInt(b.date.split(' ')[1])));
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
    return days
});

//Get all reps I have worked for each workout
const reps = [];

counts.map(count => count.name === 'Pushups' && reps.push(count.reps.map(a => a.num)));


console.log(reps);


const t = []
counts.map(count => {
    const data = {
        datasets: [{
            label: count.name,
            data: count.reps.map(a => a.num),
            backgroundColor: ['rgba(0, 96, 255, 0.2)'],
            borderColor: ['rgba(0, 96, 255, 1)'],
            borderWidth: 2
        }]
    }
    t.push(data)
})

t.map(a => console.log(a.datasets[0]))

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [...new Set(days)],
        datasets: [{
            label: 'Pushes',
            data: reps[0],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {beginAtZero: true}
            }]
        }
    }
});