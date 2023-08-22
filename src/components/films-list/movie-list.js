import PropTypes from 'prop-types'
import React from 'react'

import './movie-list.css'

import Movie from '../film-item/movie'

export default function MovieList({ movies }) {
  const elementMovies = movies.map((movie) => {
    return <Movie movie={movie} key={movie.id} />
  })
  return <ul className="movie-list">{elementMovies}</ul>
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      poster_path: PropTypes.string,
      overview: PropTypes.string,
      release_date: PropTypes.instanceOf(Date),
      vote_average: PropTypes.number,
    })
  ),
}

MovieList.defaultProps = {
  movies: [],
}
