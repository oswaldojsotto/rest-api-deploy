const express = require("express");
const crypto = require("node:crypto");
const app = express();

const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");

app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World qlq sapo",
  });
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  //filter by genre then compare with lowercase
  if (genre) {
    const moviesByGenre = movies.filter(movie =>
      movie.genre.some(gen => gen.toLowerCase() === genre.toLowerCase())
    );
    return res.json(moviesByGenre);
  }
  return res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id);
  if (movie) {
    res.status(400).json(movie);
  }

  res.json({ message: "Movie not Found" });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.unshift(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
