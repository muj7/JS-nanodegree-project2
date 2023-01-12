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

  updateRoverInfo(rover).then((results) => {
    results;
    document.getElementById("RoverInfo").innerHTML = results;
  });

  return `
        <header></header>
        <main>
        <div class="Btns"> 
        ${Selected(RovrerArray, SelectedRover)}
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

//this is HOF
const UpdateRover = (rover, updateStore) => {
  store = store.set("SelectedRover", rover);
  updateStore(store, store);
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

const updatePhoto = (rover) => {
  if (rover.imges[0] && rover.imges[1]) {
    return `<img src="${rover.imges[0]}" />
          <img src="${rover.imges[1]}" />`;
  } else {
    return `<img src="${rover.imges[0]}" />`;
  }
};

//HOF
const newRoverInfo = async (rover) => {
  if (typeof rover.name !== "object") {
    return `
  <ul style="list-style-type: square;"> 
    <li>${rover.name}</li>
    <li>Landing Date</li>
    <li>${rover.landing_date}</li>
    <li>Launch Date</li>
    <li>${rover.launch_date}</li>
    <li>Status</li>
    <li>${rover.status}</li>
    ${updatePhoto(rover)} 
  </ul>
  `;
  } else {
    const Objrover = Object.values(rover);
    return `
  <ul style="list-style-type: square;"> 
    <li>${Objrover[0]["rover"]["name"]}</li>
    <li>Landing Date</li>
    <li>${Objrover[0]["rover"]["landing_date"]}</li>
    <li>Launch Date</li>
    <li>${Objrover[0]["rover"]["launch_date"]}</li>
    <li>Status</li>
    <li>${Objrover[0]["rover"]["status"]}</li>
    ${updatePhoto(rover)} 
  </ul>
  `;
  }
};

const updateRoverInfo = async (rover) => {
  if (rover != undefined) {
    const details = await RoverInfo(rover);
    const dispaly = await newRoverInfo(details);
    return dispaly;
  } else {
    return "";
  }
};

const RoverInfo = async (rover) => {
  try {
    const res = await fetch(`http://localhost:3000/RoverDetails?name=${rover}`);
    const data = await res.json();
    console.log("Received Data from Backend: ", data);
    return data;
  } catch {
    console.log("No Data Received");
  }
};
