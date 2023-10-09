export default function refreshRating(ratings, movies) {
  return movies.map((movie) => {
    const { id } = movie
    const found = ratings.find((rating) => rating.id === id)
    return found !== undefined ? { ...movie, rating: found.rating } : movie
  })
}
