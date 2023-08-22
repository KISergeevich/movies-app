import React from 'react'
import { Rate } from 'antd'
import { isDate, format } from 'date-fns'
import PropTypes from 'prop-types'
import './movie.css'

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

export default function Movie({ movie }) {
  const { title, poster_path: posterPath, overview, release_date: dateRelease, vote_average: voteAverage } = movie
  return (
    <li className="movie-container">
      <img
        className="movie-сard__img--desktop"
        src={posterPath == null ? '/assets/img/zagluska.png' : `https://image.tmdb.org/t/p/w500${posterPath}`}
        alt="альтернативный текст"
        border="0"
      />
      <div className="movie-сard">
        <div className="movie-сard__header">
          <img
            className="movie-сard__img--mobile"
            src={posterPath == null ? '/assets/img/zagluska.png' : `https://image.tmdb.org/t/p/w500${posterPath}`}
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
            <div className="movie-сard__genres">
              <div className="movie-сard__genre">Action</div>
              <div className="movie-сard__genre">Drama</div>
            </div>
          </div>
          <div className="movie-сard__rate">{voteAverage.toFixed(1)}</div>
        </div>
        <div className="movie-сard__overview">{lengthText(overview)}</div>
        <Rate className="movie-сard__rating" allowHalf disabled count={10} value={voteAverage} />
      </div>
    </li>
  )
}

Movie.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    poster_path: PropTypes.string,
    overview: PropTypes.string,
    release_date: PropTypes.instanceOf(Date),
    vote_average: PropTypes.number,
  }),
}

Movie.defaultProps = {
  movie: {},
}
