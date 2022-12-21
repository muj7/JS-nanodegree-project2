//const { Map, List } = required('immutable');
let store = Immutable.Map({
    user: { name: "Student" },
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
}) 

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            <form>
  <fieldset>
    <legend>Please select Rover:</legend>
    <div>
      <input type="radio" id="curiosity" value="curiosity ${Array(store.apod?.latest_photos)?.[0]?.[0].rover.name == 'Curiosity' ?'active':''} " onclick="getCuriosity()" />
      <label for="curiosity">Curiosity</label>

      <input type="radio" id="opportunity" value="opportunity" ${Array(store.apod?.latest_photos)?.[0]?.[0].rover.name == 'Opportunity' ?'active':''} " onclick="getOpportunity()"/>
      <label for="opportunity">Opportunity</label>

      <input type="radio" id="spirit" value="spirit" ${Array(store.apod?.latest_photos)?.[0]?.[0].rover.name == 'Spirit' ?'active':''} onclick="getSpirit()"/>
      <label for="Spirit">Spirit</label>
    </div>
  </fieldset>
</form>
      <div class="RoverInfo"> 
          ${RoverInfo()}
       <div> 
          ${newPhotos()}
        </div>
        </div> 
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
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

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS


// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`https://r950324c957034xreactr0lcusuk-3000.udacity-student-workspaces.com/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}

const getCuriosity = () => 
{
  fetch(`http://localhost:3000/curiosity`)
  	.then(res => res.json())
  	.then(apod => updateStore(store,{ apod }));
  return store
}

const getOpportunity = () => {
  fetch(`http://localhost:3000/opportunity`)
  	.then(res => res.json())
  	.then(apod => updateStore(store,{ apod }))
  return store
}

const getSpirit = () => 
{
  fetch(`http://localhost:3000/spirit`)
  	.then(res => res.json())
  	.then(apod => updateStore(store, { apod }))
  return store
}

const updatePhoto = (array) => {
  return array.map((item) => 
      ` 
      <div> 
      <p> Latest Photos</p>
      <img src="${item.img_src}" >
      </div>
       `).slice(0, 100).join("")
} 

const newPhotos = () => {
  if(store?.apod?.latest_photos){
    return updatePhoto(store?.apod?.latest_photos)
  }
return ''
}


const newRoverInfo = (rover) => {
  return `
  <div class="RoverInfo">
  <ul> 
    <span>Landing Date</span>
    <li>${rover.landing_date}</li>
    <span>Launch Date</span>
    <li>${rover.launch_date}</li>
    <span>Status</span>
    <li>${rover.status}</li>
  </ul>
  </div> 
  `
}


const RoverInfo = () => {
  const rover = Array(store.apod?.latest_photos)?.[0]?.[0].rover;
  if(rover != undefined){
    return newRoverInfo(rover)
  }
  return ''
}