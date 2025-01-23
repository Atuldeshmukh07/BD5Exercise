const express = require("express");
const { chef } = require("./models/chef.js");
const { sequelize } = require("./lib/index.js");
const { dish } = require("./models/dish.js");
const app = express();

app.use(express.json());

const dishes = [
  {
    name: "Margherita Pizza",
    cuisine: "Italian",
    preparationTime: 20,
  },
  {
    name: "Sushi",
    cuisine: "Japanese",
    preparationTime: 50,
  },
  {
    name: "Poutine",
    cuisine: "Canadian",
    preparationTime: 30,
  },
];

const chefs = [
  { name: "Gordon Ramsay", birthYear: 1966 },
  { name: "Masaharu Morimoto", birthYear: 1955 },
  { name: "Ricardo Larrivée", birthYear: 1967 },
];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await chef.bulkCreate(chefs);
    await dish.bulkCreate(dishes);
    res.status(200).json({ message: "Database seeding successfull." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data.", error: error.message });
  }
});

// < ---------------------- Fetch all Chefs ------------------------- >
async function fetchAllChefs() {
  let chefs = await chef.findAll();
  return { chefs };
}

app.get("/chefs", async (req, res) => {
  try {
    let response = await fetchAllChefs();

    if (response.chefs.length === 0) {
      res.status(404).json({ message: "No Chefs found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  < -------------------- Fetch all Dishes --------------------------- >
async function fetchAllDishes() {
  let dishes = await dish.findAll();
  return { dishes };
}

app.get("/dishes", async (req, res) => {
  try {
    let response = await fetchAllDishes();

    if (response.dishes.length === 0) {
      res.status(404).json({ message: "No Dishes found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 1: Create New Chef.
async function addNewChef(newChef) {
  let newData = await chef.create(newChef);
  return { newData };
}

app.post("/chefs/new", async (req, res) => {
  try {
    let newChef = req.body.newChef;
    let response = await addNewChef(newChef);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Update Chef by ID.
async function updateChefById(id, newChefData) {
  let chefDetails = await chef.findOne({ where: { id } });
  if (!chefDetails) {
    return {};
  }
  chefDetails.set(newChefData);
  let updatedChef = await chefDetails.save();
  return { message: "Chef updated successfully", updatedChef };
}

app.post("/chefs/update/:id", async (req, res) => {
  try {
    let newChefData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateChefById(id, newChefData);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
