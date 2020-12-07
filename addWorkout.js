window.onload = () =>  {
    const display = document.getElementById('displayWorkouts');
    const single = document.getElementsByClassName('single');
    let workouts = [];

    const date = new Date();
    const human_date = date.toUTCString().substr(0, 16).replace(',', '');
    const my_date = human_date.split(' ');
    const final_date = `${my_date[0]}, ${my_date[1]} ${my_date[2]} ${my_date[3]}`;

    const saveWorkout = (loc) => {
        $(loc).on('click', function(e){
            let exercise = [];
            for (const [key, value] of Object.entries(single)) {
                if(value.children[1].value && e.target.previousElementSibling.value){
                    const savedDate = e.target.previousElementSibling.valueAsDate.toUTCString()
                    exercise.push({
                        'name': value.children[0].value,
                        'reps': value.children[1].value,
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
                value.children[1].value = '';
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
        if(e.target.parentNode.id === 'push'){
            $('#pushes').append(`
                <div class='single'>
                    <select id='push-wourkouts'>
                        <option value='Pushups'>Pushups</option>
                        <option value='Dips'>Dips</option>
                        <option value='Bench Press'>Bench Press</option>
                        <option value='Triceps Extension'>Triceps Extension</option>
                        <option value='Military Press'>Military Press</option>
                        <option value='Cable Pull'>Cable Pull</option>
                        <option value='Hindu Pushups'>Hindu Pushups</option>
                        <option value='Ab Rollout'>Ab Rollout</option>
                    </select>
                    <input type='text' placeholder='Number of reps' min="0"/>
                </div>
            `);
        }
    });
    saveWorkout('#savePush')

    //PULL
    $('#addPull').on('click', function(e){
        if(e.target.parentNode.id === 'pull'){
            $('#pulls').append(`
                <div class='single'>
                    <select id='pull-wourkouts'>
                        <option value='Pullups'>Pullups</option>
                        <option value='Deadlift'>Deadlift</option>
                        <option value='Dead Hang'>Dead Hang</option>
                        <option value='Bicep Curl'>Bicep Curl</option>
                        <option value='Diver Pullup'>Diver Pullup</option>
                        <option value='Barbel Row'>Barbel Row</option>
                        <option value='Shadow Boxing'>Shadow Boxing</option>
                    </select>
                    <input type='number' placeholder='Number of reps' min="0"/>
                </div>
            `);
        }
    });
    saveWorkout('#savePull')

    //LEGS
    $('#addLegs').on('click', function(e){
        if(e.target.parentNode.id === 'legs'){
            $('#legses').append(`
                <div class='single'>
                <select id='legs-wourkouts'>
                        <option value='Squat'>Squat</option>
                        <option value='Calf Raises'>Calf Raises</option>
                        <option value='Pistol Squat'>Pistol Squat</option>
                        <option value='Weighted Squat'>Weighted Squat</option>
                        <option value='Romanian Deadlift'>Romanian Deadlift</option>
                        <option value='Jogging/Sprinting'>Jogging/Sprinting</option>
                    </select>
                    <input type='number' placeholder='Number of reps' min="0"/>
                </div>
            `);
        }
    });
    saveWorkout('#saveLegs');

    //REST
    $('#saveRest').on('click', function(){
        workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        workouts.push({
            "type": "rest",
            "exercises": [{"name": "Rest", "reps": "", "date": final_date}]
        })
        localStorage.setItem('workouts', JSON.stringify(workouts));
    });

    // Render sorted workouts from localStorage on screen by month
    const d = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[d.getMonth() - 1];
    workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const sortedWorkouts = workouts.sort((a, b) => parseInt(a.date.split(' ')[1]) - parseInt(b.date.split(' ')[1]));
    sortedWorkouts.map(workout => {
        if(currentMonth.includes(workout.exercises[0].date.split(' ')[2]))
            display.innerHTML += `
                <div class='workout-card'>
                    <span class='workout-card__close'>&times;</span>
                    ${workout.type === 'pull' 
                        ? "<img src='./media/pullup.png'/>" 
                        : workout.type === 'push' 
                            ? "<img src='./media/pushup.png'/>" 
                            : workout.type === 'legs' 
                                ? "<img src='./media/leg.png'/>" 
                                : "<img src='./media/rest.png'/>"}
                    <h2>${workout.type}</h2>
                    ${workout.exercises[0].date && `<p>${workout.exercises[0].date}</p>`}
                    <div>
                        ${workout.exercises[0].name 
                            ? workout.exercises.map(exercise => `
                                <div>
                                    <p>${exercise.name} -> ${exercise.reps}</p>
                                </div>
                            `).join('')
                            : ''}
                    </div>
                </div>
            `;
    });

    // Remove item from array and ls on clicked x
    $('.workout-card__close').click(function(e){
        const clickedDate = e.target.parentNode.children[3].innerText;
        const index = workouts.findIndex(x => x.date === clickedDate);
        workouts.splice(index, 1);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    });
}