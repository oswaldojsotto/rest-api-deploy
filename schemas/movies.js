const z = require("zod");

const movieSchema = z.object({
  title: z.string(),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string(),
  genre: z.array(
    z.enum(["Action", "Drama", "Romance", "Adventure", "Horror", "Violenta"])
  ),
});

function validateMovie(input) {
  return movieSchema.safeParse(input);
}

function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input);
}

module.exports = { validateMovie, validatePartialMovie };
