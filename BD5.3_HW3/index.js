const { company } = require("./models/company_model.js");
const { sequelize } = require("./lib/index.js");
const express = require("express");
const app = express();
app.use(express.json());

const companyData = [
  {
    id: 1,
    name: "Tech Innovators",
    industry: "Technology",
    foundedYear: 2010,
    headquarters: "San Francisco",
    revenue: 75000000,
  },
  {
    id: 2,
    name: "Green Earth",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Portland",
    revenue: 50000000,
  },
  {
    id: 3,
    name: "Innovatech",
    industry: "Technology",
    foundedYear: 2012,
    headquarters: "Los Angeles",
    revenue: 65000000,
  },
  {
    id: 4,
    name: "Solar Solutions",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Austin",
    revenue: 60000000,
  },
  {
    id: 5,
    name: "HealthFirst",
    industry: "Healthcare",
    foundedYear: 2008,
    headquarters: "New York",
    revenue: 80000000,
  },
  {
    id: 6,
    name: "EcoPower",
    industry: "Renewable Energy",
    foundedYear: 2018,
    headquarters: "Seattle",
    revenue: 55000000,
  },
  {
    id: 7,
    name: "MediCare",
    industry: "Healthcare",
    foundedYear: 2012,
    headquarters: "Boston",
    revenue: 70000000,
  },
  {
    id: 8,
    name: "NextGen Tech",
    industry: "Technology",
    foundedYear: 2018,
    headquarters: "Chicago",
    revenue: 72000000,
  },
  {
    id: 9,
    name: "LifeWell",
    industry: "Healthcare",
    foundedYear: 2010,
    headquarters: "Houston",
    revenue: 75000000,
  },
  {
    id: 10,
    name: "CleanTech",
    industry: "Renewable Energy",
    foundedYear: 2008,
    headquarters: "Denver",
    revenue: 62000000,
  },
];

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await company.bulkCreate(companyData);
    res.status(200).json({ message: "Database seeding successfull." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data.", error: error.message });
  }
});

// Exercise 1: Fetch all companies.
async function fetchAllCompanies() {
  let companies = await company.findAll();
  return { companies };
}

app.get("/companies", async (req, res) => {
  try {
    let response = await fetchAllCompanies();

    if (response.companies.length === 0) {
      res.status(404).json({ message: "No company found." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Add a new company in the database.
async function addNewCompany(companyData) {
  let newCompany = await company.create(companyData);
  return { message: "Company added successfully.", newCompany };
}

app.post("/companies/new", async (req, res) => {
  try {
    let newCompany = req.body.newCompany;
    let response = await addNewCompany(newCompany);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Update company information.
async function updateCompanyById(updatedCompanyData, id) {
  let companyDetails = await company.findOne({ where: { id } });
  if (!companyDetails) {
    return null;
  }
  companyDetails.set(updatedCompanyData);
  let updatedCompany = await companyDetails.save();
  return {
    message: "Data updated successfully for Company id: " + id,
    updatedCompany,
  };
}

app.post("/companies/update/:id", async (req, res) => {
  try {
    let newCompanyData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateCompanyById(newCompanyData, id);
    if (!response) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Delete a company from the database.
async function deleteCompanyById(id) {
  let destroyCompany = await company.destroy({ where: { id } });
  if (destroyCompany === 0) {
    return {};
  }
  return { message: "Company id: " + id + " deleted successfully." };
}

app.post("/companies/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteCompanyById(id);
    if (!response) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
