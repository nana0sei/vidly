const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const admin = require("../middleware/admin");
const { Genre, validateGenre } = require("../models/genre");
const validateObjectId = require("../middleware/validateObjectId");
const mongoose = require("mongoose");

//get requests
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name").select("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("name");
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

//post request
router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });

  try {
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
});

//put request
router.put(
  "/:id",
  [auth, validateObjectId, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).send("Genre not found");

    res.send(genre);
  }
);

//delete request
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

module.exports = router;
