/* eslint-disable indent */
import PropTypes from 'prop-types'
import React from 'react'
import { Spin, Alert, Pagination } from 'antd'

import { GenresConsumer } from '../../services/genres-context'
import './movie-list.css'
import Movie from '../film-item/movie'

export default function MovieList({ model, onPage, onRating }) {
  const elementMovies = model.items.map((movie) => {
    return (
      <GenresConsumer key={movie.id}>
        {(genres) => {
          return (
            <Movie
              movie={movie}
              key={movie.id}
              genres={genres}
              onRating={(movieId, rating) => onRating(movieId, rating)}
            />
          )
        }}
      </GenresConsumer>
    )
  })
  switch (model.status) {
    case 'loading':
      return <Spin className="spin" size="large" />
    case 'success':
      return (
        <div>
          <ul className="movie-list">{elementMovies}</ul>
          <Pagination
            className="pagination"
            defaultCurrent={1}
            total={model.total}
            onChange={(p) => onPage(p)}
            hideOnSinglePage
            pageSize={20}
            current={model.page}
            showSizeChanger={false}
          />
        </div>
      )
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
  model: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        poster_path: PropTypes.string,
        overview: PropTypes.string,
        release_date: PropTypes.string,
        vote_average: PropTypes.number,
      })
    ),
    status: PropTypes.string,
    page: PropTypes.number,
    total: PropTypes.number,
  }),
  onPage: PropTypes.func,
}

MovieList.defaultProps = {
  model: {},
  onPage: () => {},
}
