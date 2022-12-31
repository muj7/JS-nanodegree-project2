let store = Immutable.Map({
  rovers: Immutable.Map({
    Curiosity: Immutable.Map({ name: "curiosity" }),
    Opportunity: Immutable.Map({ name: "opportunity" }),
    Spirit: Immutable.Map({ name: "spirit" }),
  }),
  SelectedRover: "spirit",
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = store.set(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (store) => {
  const SelectedRover = store.get("SelectedRover");
  const rover = store.get("SelectedRover");
  const RovrerArray = Object.keys(store.get("rovers").toObject());

  return `
        <header></header>
        <main>
        <div> 
        ${Selected(RovrerArray, SelectedRover)}
        </div>  
      <div class="RoverInfo"> 
          ${rover}
       <div> 
          ${updateRoverInfo()}
        </div>
        </div> 
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
/* const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};
*/
// ------------------------------------------------------  API CALLS

// Example API call
/*
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(
    `https://r950324c957034xreactr0lcusuk-3000.udacity-student-workspaces.com/apod`
  )
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  return data;
};
*/

const UpdateRover = (rover) => {
  updateStore(store, rover);
  RoverInfo(rover);
};

const Selected = (RovrerArray, SelectedRover) => {
  return RovrerArray.map((rover) => {
    if (rover.toLowerCase() === SelectedRover.toLowerCase()) {
      return `<button style="color:red" onclick="UpdateRover('${rover}')"> ${rover} </button>`;
    } else {
      return `<button style="color:Blue" onclick="UpdateRover('${rover}')"> ${rover} </button>`;
    }
  });
};

const updatePhoto = (array) => {
  return array
    .map(
      (item) =>
        ` 
      <div> 
      <p> Latest Photos</p>
      <img src="${item.img_src}" >
      </div>
       `
    )
    .slice(0, 10)
    .join("");
};

//const newPhotos = () => {
 //   return updatePhoto(rover.toArray());
//};

const newRoverInfo = () => {
  const rover = RoverInfo();
  return `
  <div class="RoverInfo">
  <ul> 
    <span>Landing Date</span>
    <li>${rover.landing_date}</li>
    <span>Launch Date</span>
    <li>${rover.launch_date}</li>
  </ul>
  </div> 
  `;
};

const updateRoverInfo = () => {
  const rover = store.get("SelectedRover");
  if (rover != undefined){
    return newRoverInfo()
  }
};

const RoverInfo = (rover) => {
  fetch(`http://localhost:3000/RoverDetails?name=${rover}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Received Data from Backend: ", data);
      return data; 
    });
};
