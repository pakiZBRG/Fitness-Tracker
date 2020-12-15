window.onload = () =>  {
    const display = document.getElementById('displayWorkouts');
    const single = document.getElementsByClassName('single');
    let workouts = [];

    const saveWorkout = (loc) => {
        $(loc).on('click', function(e){
            let exercise = [];
            for (const [key, value] of Object.entries(single)) {
                if(value.children[1].children[1].value && e.target.previousElementSibling.value){
                    const savedDate = e.target.previousElementSibling.valueAsDate.toUTCString()
                    exercise.push({
                        'name': value.children[0].children[1].value,
                        'reps': value.children[1].children[1].value,
                        "date": savedDate.substr(0, 16)
                    })
                }
            }
            workouts = JSON.parse(localStorage.getItem('workouts')) || [];
            if(exercise.length){
                workouts.push({
                    "type": e.target.parentNode.id,
                    "exercises": exercise,
                    "date": exercise[0].date
                })
            } else {
                alert('Insert exercises')
            }
            for (const [key, value] of Object.entries(single)) {
                value.children[1].children[1].value = '';
            }
            localStorage.setItem('workouts', JSON.stringify(workouts));
        })
    }

    $(document).on('click', '#work', function(e) {
        e.preventDefault();
        $(this).addClass("black").siblings().removeClass('black');
    });

    $('#workout h3').on('click', function(){
        const target = $(this).attr('rel');
        $("#"+target).fadeIn('slow').siblings("div").hide();
    });

    //PUSH
    $('#addPush').on('click', function(e){
        if(e.target.parentNode.parentNode.id === 'push'){
            $('#pushes').append(`
                <div class='single'>
                    <div>
                        <label for='push-workouts'>Choose exercise</label>
                        <select id='push-workouts'>
                            <option value='Pushups'>Pushups</option>
                            <option value='Dips'>Dips</option>
                            <option value='Bench Press'>Bench Press</option>
                            <option value='Triceps Extension'>Triceps Extension</option>
                            <option value='Military Press'>Military Press</option>
                            <option value='Cable Pull'>Cable Pull</option>
                            <option value='Hindu Pushups'>Hindu Pushups</option>
                            <option value='Ab Rollout'>Ab Rollout</option>
                        </select>
                    </div>
                    <div>
                        <label for='reps'>How many reps?</label>
                        <input type='number' placeholder='Input number' id='reps' min="0"/>
                    </div>
                </div>
            `);
        }
    });
    saveWorkout('#savePush')

    //PULL
    $('#addPull').on('click', function(e){
        if(e.target.parentNode.parentNode.id === 'pull'){
            $('#pulls').append(`
                <div class='single'>
                    <div>
                        <label for='pull-workouts'>Choose exercise</label>
                        <select id='pull-workouts'>
                            <option value='Pullups'>Pullups</option>
                            <option value='Deadlift'>Deadlift</option>
                            <option value='Dead Hang'>Dead Hang</option>
                            <option value='Bicep Curl'>Bicep Curl</option>
                            <option value='Superman'>Superman</option>
                            <option value='Barbel Row'>Barbel Row</option>
                            <option value='Shadow Boxing'>Shadow Boxing</option>
                        </select>
                    </div>
                    <div>
                        <label for='reps'>How many reps?</label>
                        <input type='number' placeholder='Input number' id='reps' min="0"/>
                    </div>
                </div>
            `);
        }
    });
    saveWorkout('#savePull')

    //LEGS
    $('#addLegs').on('click', function(e){
        if(e.target.parentNode.parentNode.id === 'legs'){
            $('#legses').append(`
                <div class='single'>
                    <div>
                        <label for='legs-workouts'>Choose exercise</label>
                        <select id='legs-workouts'>
                            <option value='Squat'>Squat</option>
                            <option value='Calf Raises'>Calf Raises</option>
                            <option value='Pistol Squat'>Pistol Squat</option>
                            <option value='Weighted Squat'>Weighted Squat</option>
                            <option value='Romanian Deadlift'>Romanian Deadlift</option>
                            <option value='Jogging/Sprinting'>Jogging/Sprinting</option>
                        </select>
                    </div>
                    <div>
                        <label for='reps'>How many reps?</label>
                        <input type='number' placeholder='Input number' id='reps' min="0"/>
                    </div>
                </div>
            `);
        }
    });
    saveWorkout('#saveLegs');

    // Render sorted workouts from localStorage on screen by month
    const d = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[d.getMonth()];
    workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const sortedWorkouts = workouts.sort((a, b) => parseInt(a.date.split(' ')[1]) - parseInt(b.date.split(' ')[1]));
    sortedWorkouts.map(workout => {
        if(currentMonth.includes(workout.exercises[0].date.split(' ')[2]))
            display.innerHTML += `
                <div class='workout-card'>
                    <span class='workout-card__close'>&times;</span>
                    <div class='workout-card__background'>
                        ${workout.type === 'pull' 
                            ? "<img src='./media/pull.jpeg'/>" 
                            : workout.type === 'push' 
                                ? "<img src='./media/push.jpeg'/>" 
                                : "<img src='./media/legs.jpeg'/>"}
                        <h2>${workout.type}</h2>
                        <p class='workout-card__background--date'>${workout.exercises[0].date}</p>
                        <div class='workout-card__background--white'>
                            <div class='workout-card__background--exercise'>
                                ${workout.exercises.map(exercise => `
                                    <p>
                                        <span>${exercise.name}</span>
                                        <span>${exercise.reps}</span>
                                    </p>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });

    // Remove item from array and localStorage on clicked x
    $('.workout-card__close').click(function(e){
        const clickedDate = e.target.parentNode.children[1].children[2].innerText;
        const index = workouts.findIndex(x => x.date === clickedDate);
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    });
}
