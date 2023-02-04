import express from "express";

const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`Server started: http://localhost:8000}/`);
  var word = "Bigups CrowdWrap";
  console.log(word);
  //concurrently 'run tsc_watch' 'npm run nm_disc_src'
  //tsc -w & nodemon ./dist/index.js
});
