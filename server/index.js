const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(express.json()); //req.body
app.use(cors());

// routes

// create a todo list

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo(description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// get all todo list

app.get("/todos", async (req, res) => {
  try {
    const allTodo = await pool.query("SELECT * FROM todo");
    res.json(allTodo.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id =$1", [id]);

    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id =$2",
      [description, id]
    );

    res.json('Todo updated!');
  } catch (error) {
    console.log(error.message);
  }
});
//delete  a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id =$1", [id])
    res.json('Todo deleted!');
  }
  catch (error){
    console.log(error.message);
  }  
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
