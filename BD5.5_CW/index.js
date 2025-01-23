const express = require("express");
const { track } = require("./models/track_model.js");
const { sequelize } = require("./lib/index.js");
const { user } = require("./models/user_model.js");
const { like } = require("./models/like_model.js");
const { Op } = require("@sequelize/core");
const app = express();

app.use(express.json());

const movieData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

// < ---------------- Seeding the database ---------------------- >
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await user.create({
      username: "testuser",
      email: "testuser@gmail.com",
      password: "testuser",
    });

    await track.bulkCreate(movieData);
    res.status(200).json({ message: "Database seeding successfull." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data.", error: error.message });
  }
});

// < ----------------- Get Like Tracks ------------------------ >
async function likeTrack(data) {
  let newLike = await like.create({
    userId: data.userId,
    trackId: data.trackId,
  });

  return { message: "Track Liked", newLike };
}

app.get("/users/:id/like", async (req, res) => {
  try {
    let userId = req.params.id;
    let trackId = req.query.trackId;

    let response = await likeTrack({ userId, trackId });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// < ----------------- Get Dislike Tracks ------------------------ >
async function dislikeTrack(data) {
  let count = await like.destroy({
    where: {
      userId: data.userId,
      trackId: data.trackId,
    },
  });

  if (count === 0) {
    return {};
  }
  return { message: "Track Disliked" };
}

app.get("/users/:id/dislike", async (req, res) => {
  try {
    let userId = req.params.id;
    let trackId = req.query.trackId;
    let response = await dislikeTrack({ userId, trackId });

    if (!response.message) {
      res.status(404).json({ message: "This track is not in your liked list" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// < ----------------- Get All Liked Tracks ------------------------ >
async function getAllLikedTracks(userId) {
  let trackIds = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });

  let trackRecords = [];

  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }
  let likedTracks = await track.findAll({
    where: { id: { [Op.in]: trackRecords } },
  });

  return { likedTracks };
}

app.get("/users/:id/liked", async (req, res) => {
  try {
    let userId = req.params.id;
    let response = await getAllLikedTracks({ userId });

    if (response.likedTracks.length === 0) {
      res
        .status(404)
        .json({ message: "No liked tracks found. Please like some tracks." });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// < ----------------- Get All Liked Tracks By Artist ------------------------ >
async function getAllLikedTracksByArtist(userId, artist) {
  let trackIds = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });

  let trackRecords = [];

  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }
  let likedTracks = await track.findAll({
    where: { id: { [Op.in]: trackRecords }, artist },
  });

  return { likedTracks };
}

app.get("/users/:id/liked-artists", async (req, res) => {
  try {
    let userId = req.params.id;
    let artist = req.query.artist;
    let response = await getAllLikedTracksByArtist(userId, artist);

    if (response.likedTracks.length === 0) {
      res.status(404).json({ message: "No liked tracks found by " + artist });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// < ----------------- Server Port 3000 ------------------------ >
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
