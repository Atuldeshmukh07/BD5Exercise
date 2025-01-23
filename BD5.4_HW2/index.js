const express = require("express");
const { course } = require("./models/course.js");
const { sequelize } = require("./lib/index.js");
const { student } = require("./models/student.js");
const app = express();

app.use(express.json());

const courses = [
  { title: "Math 101", description: "Basic Mathematics" },
  { title: "History 201", description: "World History" },
  { title: "Science 301", description: "Basic Sciences" },
];

const students = [{ name: "John Doe", age: 24 }];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await course.bulkCreate(courses);
    await student.bulkCreate(students);
    res.status(200).json({ message: "Database seeding successfull." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data.", error: error.message });
  }
});

// < ---------------------- Fetch all Courses ------------------------- >
async function fetchAllCourses() {
  let courses = await course.findAll();
  return { courses };
}

app.get("/courses", async (req, res) => {
  try {
    let response = await fetchAllCourses();

    if (response.courses.length === 0) {
      res.status(404).json({ message: "No Courses found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  < -------------------- Fetch all Students --------------------------- >
async function fetchAllStudents() {
  let students = await student.findAll();
  return { students };
}

app.get("/students", async (req, res) => {
  try {
    let response = await fetchAllStudents();

    if (response.students.length === 0) {
      res.status(404).json({ message: "No Students found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 1: Create New Student.
async function addNewStudent(newStudent) {
  let newData = await student.create(newStudent);
  return { newData };
}

app.post("/students/new", async (req, res) => {
  try {
    let newStudent = req.body.newStudent;
    let response = await addNewStudent(newStudent);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Update Student  by ID.
async function updateStudentById(id, newStudentData) {
  let studentDetails = await student.findOne({ where: { id } });
  if (!studentDetails) {
    return {};
  }
  studentDetails.set(newStudentData);
  let updatedStudent = await studentDetails.save();
  return { message: "Student updated successfully", updatedStudent };
}

app.post("/students/update/:id", async (req, res) => {
  try {
    let newStudentData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateStudentById(id, newStudentData);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
