export default function upsertRating(id, newRating, ratings) {
  if (ratings.some((rating) => rating.id === id)) {
    return ratings.map((rating) => {
      if (rating.id === id) {
        return {
          id,
          rating: newRating,
        }
      }
      return rating
    })
  }
  return [...ratings, { id, rating: newRating }]
}
