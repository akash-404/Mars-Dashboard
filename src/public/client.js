//global variable to store all out data needed globally 
let store = {
    user: { name: "Akash" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverData: {name:'', launch_date:'', landing_date:'',mars_days:0, status:'', total_photos:0},
    roverImageArray: []
}

// add our markup to the page
const root = document.getElementById('root');

//fucntion to update global object
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>These are 3 of five rovers on mars by NASA</h3>
                <p>Please select a rover:</p>
                <div class="rover_menu">
                    <img src='assets/images/curiosity.jpg' id='curiosity' class='rover_image' alt='curiosity' title="Curiosity">
                    <img src='assets/images/opportunity.jpg' id='opportunity' class='rover_image' alt='opportunity' title="Opportunity">
                    <img src='assets/images/spirit.jpg' id='spirit' class='rover_image' alt='spirit' title="Spirit">
            </section>
        </main>
        <footer></footer>
    `
}


const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

//used Event Delegation to add event listeners to photos
const roverDataDOM = document.getElementById('roverData');
const roverImagesDOM = document.getElementById('roverImages');

root.addEventListener('click', function(e){
    if(e.target && e.target.matches("#curiosity")) {
        renderData(roverDataDOM, roverImagesDOM, 'curiosity', store)
        e.target.classList.add('isActiveRover');
	}
    else if(e.target && e.target.matches("#opportunity")) {
        renderData(roverDataDOM, roverImagesDOM, 'opportunity', store)
        e.target.classList.add('isActiveRover');
	}
    else if(e.target && e.target.matches("#spirit")) {
        renderData(roverDataDOM, roverImagesDOM, 'spirit', store)
        e.target.classList.add('isActiveRover');
	}
})
// ------------------------------------------------------  COMPONENTS

const renderData = async (roverDataDOM, roverImagesDOM, roverName, state) =>{
    roverDataDOM.innerHTML = await generateData(state, roverName)
    roverImagesDOM.innerHTML = await generateImages(state, roverName)
}

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

const generateData = async (state, r_name)=>{
    await getMarsRoverData(state, r_name)
    return `
    <p>
        <b>Name:</b> &nbsp&nbsp&nbsp ${state.roverData.name}<br><br>
        <b>Status:</b> &nbsp&nbsp&nbsp ${state.roverData.status}<br><br>
        <b>Launch date:</b> &nbsp&nbsp&nbsp ${state.roverData.launch_date}<br><br>
        <b>Landing Date:</b> &nbsp&nbsp&nbsp ${state.roverData.landing_date}<br><br>
        <b>No. of Mars days active:</b> &nbsp&nbsp&nbsp ${state.roverData.mars_days}<br><br>
        <b>Total Phostos sent:</b> &nbsp&nbsp&nbsp ${state.roverData.total_photos}<br><br>
    </p>
    `
}

const generateImages = async (state, r_name)=>{
    await getMarsRoverImage(state, r_name)
    return`
    <center>
        <h2><u>Latest Photo</u></h2>
        ${state.roverImageArray.map(ele => genImages(state, ele.img_src, ele.earth_date, ele.camera.full_name))}
    </center>
    `
}

const genImages = (state,url, date, fullName) =>{
    return `
    <img src=${url}>
    <p>
        Date: &nbsp ${date}<br><br>
        Taken by camera: &nbsp ${fullName}
    </p>
    `
}


// ------------------------------------------------------  API CALLS
const getMarsRoverData = async (state,roverName) => {
    await fetch('http://localhost:3000/marsRoverData',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
    .then(res => res.json())
    .then(data => {
        let roverData = {name:data.photo_manifest.name, 
            launch_date:data.photo_manifest.launch_date, 
            landing_date:data.photo_manifest.landing_date,
            mars_days:data.photo_manifest.max_sol, 
            status:data.photo_manifest.status, 
            total_photos:data.photo_manifest.total_photos}
        updateStore(state, { roverData })     
    })    
}

const getMarsRoverImage = async (state,roverName) => {
    await fetch('http://localhost:3000/marsRoverImage',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
    .then(res => res.json())
    .then(data => {
        // let roverImage = {url:data.latest_photos[0].img_src,
        //     date:data.latest_photos[0].earth_date,
        //     camera:data.latest_photos[0].camera.full_name,
        // }
        updateStore(state,{roverImageArray:data.latest_photos})
    })  
}
