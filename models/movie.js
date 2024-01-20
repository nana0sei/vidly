const mongoose = require("mongoose");
const Joi = require("joi");

const validate = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255),
    dailyRentalRate: Joi.number().min(0).max(100),
  });

  return schema.validate(movie);
};

const genreSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
});

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
      trim: true,
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, default: 0, min: 0, max: 255 },
    dailyRentalRate: { type: Number, default: 0, min: 0, max: 100 },
  })
);

exports.Movie = Movie;
exports.validate = validate;
