const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const dbConfig = require("./database");
const app = express();

app.use(express.json());
app.use(cors());

const client = new Client(dbConfig);

async function connectTodB() {
  try {
    await client.connect();
    app.listen(3002, () => {
      console.log("listening on port 3002");
    });
  } catch (err) {
    console.error("Error connecting to Database", err);
  }
}

connectTodB();

app.get("/signIn", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users;");
    res.json(result.rows);
  } catch (err) {
    console.error("Error querying users", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signUp", async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    await client.query("INSERT INTO users (email, password) VALUES ($1, $2);", [
      payload.username,
      payload.password,
    ]);
    res.json({ status: "success" }).status(201);
  } catch (err) {
    res.json({ error: err.message }).status(400);
  }
});
