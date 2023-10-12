import React from 'react'
import { Rate, Alert } from 'antd'
import { isDate, format } from 'date-fns'
import PropTypes from 'prop-types'
import './movie.css'
import classNames from 'classnames'

import zagluska from '../../assets/img/zagluska.png'

function lengthText(str) {
  if (str === '') {
    return 'There is no overview about this film'
  }
  if (str.length < 200) {
    return str
  }
  let newText = str.slice(0, 200)
  let simv = str.charAt(str.length - 1)

  while (simv !== ' ') {
    newText = newText.slice(0, newText.length - 1)
    simv = newText.charAt(newText.length - 1)
  }
  return newText.trimEnd().concat('...')
}

export default function Movie({ movie, genres, onRating }) {
  const {
    id,
    title,
    rating,
    poster_path: posterPath,
    overview,
    release_date: dateRelease,
    vote_average: voteAverage,
    genre_ids: genresIDs,
  } = movie
  let checkedGenres
  if (genres.status !== 'none' && genres.status !== 'success') {
    checkedGenres = <Alert message="Genres failed" type="error" />
  } else {
    checkedGenres = genresIDs.map((genreId) => {
      const foundGenre = genres.genres.find((genre) => genre.id === genreId)
      return foundGenre === undefined ? null : (
        <div key={foundGenre.id} className="movie-сard__genre">
          {foundGenre.name}
        </div>
      )
    })
  }
  return (
    <li className="movie-container">
      <img
        className="movie-сard__img--desktop"
        src={posterPath == null ? zagluska : `https://image.tmdb.org/t/p/w500${posterPath}`}
        alt="альтернативный текст"
        border="0"
      />
      <div className="movie-сard">
        <div className="movie-сard__header">
          <img
            className="movie-сard__img--mobile"
            src={posterPath == null ? zagluska : `https://image.tmdb.org/t/p/w500${posterPath}`}
            alt="альтернативный текст"
            border="0"
          />
          <div className="movie-сard__information">
            <div className="movie-сard__title">{title}</div>
            <div className="movie-сard__date">
              {dateRelease !== '' && isDate(new Date(dateRelease))
                ? format(new Date(dateRelease), 'MMMM dd, yyyy')
                : 'Date is unknown'}
            </div>
            <div className="movie-сard__genres">{checkedGenres}</div>
          </div>
          <div
            className={classNames('movie-сard__rate', {
              'movie-сard__rate--red': voteAverage < 3 && voteAverage >= 0,
              'movie-сard__rate--orange': voteAverage >= 3 && voteAverage < 5,
              'movie-сard__rate--yellow': voteAverage >= 5 && voteAverage < 7,
              'movie-сard__rate--green': voteAverage >= 7,
            })}
          >
            {voteAverage.toFixed(1)}
          </div>
        </div>
        <div className="movie-сard__overview">{lengthText(overview)}</div>
        <Rate
          className="movie-сard__rating"
          count={10}
          onChange={(rate) => {
            if (rate !== 0) {
              onRating(id, rate)
            }
          }}
          value={rating}
        />
      </div>
    </li>
  )
}

Movie.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    poster_path: PropTypes.string,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
  }),
}

Movie.defaultProps = {
  movie: {},
}
