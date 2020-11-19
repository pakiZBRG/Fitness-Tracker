window.onload = () =>  {
    const display = document.getElementById('display');
    let workouts = [];
    const date = new Date();
    const human_date = date.toUTCString().substr(0, 16).replace(',', '');
    const my_date = human_date.split(' ');
    const final_date = `${my_date[1]} ${my_date[2]} ${my_date[3]}, ${my_date[0]}`;

    const saveWorkout = (loc, arr1) => {
        $(loc).on('click', function(e){
            let a = []
            for (let [key, value] of Object.entries($(arr1).children())) {
                if(value.value !== undefined) {
                    a.push(value.value)
                }
            }
            workouts = JSON.parse(localStorage.getItem('workouts')) || [];
            workouts.push({
                "type": e.target.parentNode.id,
                "exercises": a,
                "date": final_date
            })
            localStorage.setItem('workouts', JSON.stringify(workouts));
            a = []
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
                <select id='push-wourkouts'>
                    <option value='Pushups'>Pushups</option>
                    <option value='Dips'>Dips</option>
                    <option value='Bench Press'>Bench Press</option>
                    <option value='Triceps Extension'>Triceps Extension</option>
                    <option value='Military Press'>Military Press</option>
                    <option value='Cable Pull'>Cable Pull</option>
                    <option value='Hindu Pushups'>Hindu Pushups</option>
                <select>
            `);
        }
    });
    saveWorkout('#savePush', '#pushes')

    //PULL
    $('#addPull').on('click', function(e){
        if(e.target.parentNode.id === 'pull'){
            $('#pulls').append(`
                 <select id='pull-wourkouts'>
                    <option value='Pullups'>Pullups</option>
                    <option value='Deadlift'>Deadlift</option>
                    <option value='Dead Hang'>Dead Hang</option>
                    <option value='Bicep Curl'>Bicep Curl</option>
                    <option value='Barbel Row'>Barbel Row</option>
                <select>
            `);
        }
    });
    saveWorkout('#savePull', '#pulls')

    //LEGS
    $('#addLegs').on('click', function(e){
        if(e.target.parentNode.id === 'legs'){
            $('#legses').append(`
               <select id='legs-wourkouts'>
                    <option value='Squat'>Squat</option>
                    <option value='Calf Raises'>Calf Raises</option>
                    <option value='Pistol Squat'>Pistol Squat</option>
                    <option value='Weighted Squat'>Weighted Squat</option>
                    <option value='Jogging/Sprinting'>Jogging/Sprinting</option>
                <select>
            `);
        }
    });
    saveWorkout('#saveLegs', '#legses');

    //REST
    $('#saveRest').on('click', function(){
        workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        workouts.push({
            "type": "rest",
            "date": final_date
        })
        localStorage.setItem('workouts', JSON.stringify(workouts));
    })

    workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    localStorage.setItem('workouts', JSON.stringify(workouts));
    workouts.map(workout => {
        display.innerHTML += `
            <div class='workout-card'>
                ${workout.type === 'pull' 
                    ? "<img src='./media/pullup.png'/>" 
                    : workout.type === 'push' 
                        ? "<img src='./media/pushup.png'/>" 
                        : workout.type === 'legs' 
                            ? "<img src='./media/leg.png'/>" 
                            : "<img src='./media/rest.png'/>"}
                <h2>${workout.type}</h2>
                <p>${workout.date}</p>
            </div>
        `;
    })
}