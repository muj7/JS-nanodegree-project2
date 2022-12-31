require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const { throws } = require("assert");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

app.get("/RoverDetails", async (req, res) => {
  try {
    const RoverName = req.query.name;
    console.log(RoverName);
    const URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${RoverName}/latest_photos?api_key=${process.env.API_KEY}`;
    const RoverData = await fetch(URL).then((res) => res.json());

    if (RoverName === undefined) {
      throw new Error("No data receved");
      }

      console.log(RoverData);
      
      const rover = {
        name: RoverData.latest_photos.reduce((acc, ctr) => {
          return ctr.rover.name;
        }),
        landing_date: RoverData.latest_photos.reduce((acc, ctr) => {
          return ctr.rover.landing_date;
        }),
        launch_date: RoverData.latest_photos.reduce((acc, ctr) => {
          return ctr.rover.launch_date;
        }),
        status: RoverData.latest_photos.reduce((acc, ctr) => {
          return ctr.status;
        }),
        images: RoverData.latest_photos.map((img) => img.img_src),
      };

      console.log(rover);

      res.send(rover);
  } catch (error) {
    console.log(error);
  }
});

app.get("/apod", async (req, res) => {
  try {
    const image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    console.log(image);
    res.send({ image });
  } catch (error) {
    console.log("Error", error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
