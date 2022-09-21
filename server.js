const mongodb = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const port = 3002;

// const hostname = "127.0.0.1";

let db;

const connectionString =
  "mongodb+srv://dragon:hello123@travel-destinations.kjlf6mx.mongodb.net/?retryWrites=true&w=majority";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (err, client) {
    db = client.db("travel_destinations_db");
    console.log("connected");
  }
);

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());

app.get("/destinations", async (req, res) => {
  const query = req.body;
  console.log(query);
  const data = await runGet(query);
  if (await data) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  }
});

async function runGet(query) {
  try {
    const destinations = db.collection("destinations").find(query).toArray();
    console.log(await destinations);
    return await destinations;
  } catch (err) {
    console.error(err);
  }
}

app.post("/destinations", async (req, res) => {
  const query = req.body;
  console.log(query.name);
  query.date = new Date("2016-05-18T16:00:00Z");

  const data = await runPost(query);
  if (await data) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  }
});

async function runPost(query) {
  try {
    const data = db.collection("destinations").insertOne(query);
    console.log(await data);
    return await data;
  } catch (err) {
    console.error(err);
  }
}

app.put("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  const set = req.body;
  console.log(id);
  console.log(set);
  const data = await runPut(id, set);
  if (await data) {
    res.send(data);
  }
});

async function runPut(id, set) {
  try {
    const ObjectID = require("mongodb").ObjectId;
    const data = db
      .collection("destinations")
      .updateOne({ _id: ObjectID(id) }, { $set: set });
    console.log(await data);
    return await data;
  } catch (err) {
    console.error(err);
  }
}

app.delete("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const data = await runDelete(id);
  if (await data) {
    res.send(data);
  }
});

async function runDelete(id) {
  try {
    const ObjectID = require("mongodb").ObjectId;
    const data = db.collection("destinations").deleteOne({ _id: ObjectID(id) });
    console.log(await data);
    return await data;
  } catch (err) {
    console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
