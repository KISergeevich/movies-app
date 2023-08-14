import React from 'react'

import Movie from '../film-item/movie'

export default function MovieList({ movies }) {
  const elementMovies = movies.map((movie) => {
    return <Movie movie={movie} key={movie.id} />
  })
  return <ul className="movie-list">{elementMovies}</ul>
}
