const d = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[d.getMonth()]
const currentYear = d.getFullYear();
const getDaysInMonth = (month,year) => new Date(year, month, 0).getDate();
$('#month').append(currentMonth);

const types = document.getElementById('types');

let doneByMonth = [];
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
console.log(workouts)
workouts.map(workout => {
    // Filter done workouts by month
    if(currentMonth.includes(workout.date.split(' ')[1]) && workout.exercises){
        workout.exercises.map(a => doneByMonth.push(a));
    }
});

console.log(doneByMonth)

// Get all done exercises and sum their reps
var counts = [];
let unique = [...new Set(doneByMonth.map(a => a.Name))]
unique.map(i => counts.push({"name": i, "reps": []}))
counts.map(i => doneByMonth.map(a => a.Name === i.name && i.reps.push(parseInt(a.Reps))))
counts.map(single => {
    types.innerHTML += `
        <div class='workout-log' id='asd'>
            <p>${single.name} ${single.reps.reduce((a, b) => a+b, 0)} [${single.reps.map(a => a)}]</p>
        </div>
    `
});

const asd = document.querySelectorAll('#asd');
asd.map

const a = getDaysInMonth(d.getMonth()+1, currentYear)
let days = [];
for(let i = 1; i < a+1; i++) days.push(i);
let reps = []
counts.map(count => count.reps.map(rep => reps.push(rep)))

new Chart(document.getElementById('myChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: days,
        datasets: [{
            label: 'Pushups',
            backgroundColor: 'rgba(136, 0, 2, .4)',
            borderColor: 'rgb(136, 0, 2)',
            data: reps
        }]
    },
    options: {}
});

new Chart(document.getElementById('myChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: days,
        datasets: [{
            label: 'Pushups',
            backgroundColor: 'rgba(136, 0, 2, .4)',
            borderColor: 'rgb(136, 0, 2)',
            data: reps
        }]
    },
    options: {}
});