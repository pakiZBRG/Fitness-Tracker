const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[d.getMonth()]
const currentYear = d.getFullYear();
const getDaysInMonth = (month,year) => new Date(year, month, 0).getDate();
$('#month').append(currentMonth);

const types = document.getElementById('types');

let doneByMonth = []
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
workouts.map(workout => {
    // Filter done workouts by month
    if(currentMonth.includes(workout.date.split(' ')[1]) && workout.exercises){
        workout.exercises.map(a => doneByMonth.push(a));
        doneByMonth.map(a => a['date'] = workout.date)
    }
});

console.log(doneByMonth)

// Get all done exercises and sum their reps
var counts = [];
let unique = [...new Set(doneByMonth.map(a => a.Name))]
unique.map(i => counts.push({"name": i, "reps": []}))
counts.map(i => doneByMonth.map(a => a.Name === i.name && i.reps.push({"num": parseInt(a.Reps), "date": a.date})))
console.log(counts)
counts.map(single => {
    types.innerHTML += `
        <div class='workout-log'>
            <h3>${single.name} - ${single.reps.reduce((a, b) => a+b.num, 0)}</h3>
            ${single.reps.map(a => `<p>${a.date.substr(0, 6)} - ${a.num}</p>`).join('')}
        </div>
    `
});

const a = getDaysInMonth(d.getMonth()+1, currentYear)
const h = d.getDate();
let days = [];
for(let i = h; i < a+1; i++) days.push(i);
let reps = []
counts.map(count => count.reps.map(rep => reps.push(rep.num)));

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: days,
        datasets: [{
            label: 'Pushes',
            data: reps,
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});