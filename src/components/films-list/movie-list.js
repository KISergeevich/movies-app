/* eslint-disable indent */
import PropTypes from 'prop-types'
import React from 'react'
import { Spin, Alert } from 'antd'

import './movie-list.css'
import Movie from '../film-item/movie'

export default function MovieList({ movies, status }) {
  const elementMovies = movies.map((movie) => {
    return <Movie movie={movie} key={movie.id} />
  })
  switch (status) {
    case 'loading':
      return <Spin size="large" />
    case 'success':
      return <ul className="movie-list">{elementMovies}</ul>
    case 'empty':
      return <Alert message="Sorry, we can't find this film" type="info" />
    case 'failed':
      return <Alert message="Sorry, something happend with server :(" type="error" />
    case 'noInternet':
      return <Alert message="Sorry, check your network" type="error" />
    default:
      return null
  }
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      poster_path: PropTypes.string,
      overview: PropTypes.string,
      release_date: PropTypes.string,
      vote_average: PropTypes.number,
    })
  ),
  status: PropTypes.string,
}

MovieList.defaultProps = {
  movies: [],
  status: 'none',
}
