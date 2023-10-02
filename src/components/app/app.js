import React, { Component } from 'react'

import { GenresProvider } from '../../services/genres-context'
import ApiMovieDB from '../../services/api-movie-db'
import './app.css'
import Header from '../header/header'
import ListFilm from '../films-list/films-list'

function refreshRating(ratedMovies, movies) {
  return movies.map((obj) => {
    const { id } = obj
    const found = ratedMovies.find((ratedObj) => ratedObj.id === id)
    return found !== undefined ? { ...obj, rating: found.rating } : obj
  })
}

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      page: 1,
      movies: [],
      total: 0,
      search: '',
      status: 'none',
      genres: [],
      tabStatus: 'search',
      ratedMovies: [],
      ratedPage: 1,
      ratedTotal: 0,
    }
    this.api = new ApiMovieDB()
  }

  async componentDidMount() {
    await this.api.createGuestSession()
    await this.getGenres()
    await this.getRatedMovies()
  }

  onTabChanged(tabStatus) {
    this.setState((state) => {
      return {
        ...state,
        tabStatus,
      }
    })
  }

  async onSearch(search) {
    await this.setState((state) => {
      return {
        ...state,
        search,
        page: 1,
        status: 'loading',
      }
    })
    const { page } = this.state
    this.fetch(search, page)
  }

  async onPage(page) {
    await this.setState((state) => {
      return {
        ...state,
        page,
        status: 'loading',
      }
    })
    const { search } = this.state
    this.fetch(search, page)
  }

  async onRating(movieId, rating) {
    const rated = await this.api.postRating(movieId, rating)
    if (rated) {
      setTimeout(() => this.getRatedMovies(), 1000)
    }
  }

  async getGenres() {
    const genres = await this.api.getGenres()
    this.setState((state) => {
      return {
        ...state,
        genres,
      }
    })
  }

  async getRatedMovies() {
    const { movies: ratedMovies, total: ratedTotal } = await this.api.getRatedMovies()
    this.setState((state) => {
      return {
        ...state,
        movies: refreshRating(ratedMovies, state.movies),
        ratedMovies,
        ratedTotal,
      }
    })
  }

  async fetch(search, page) {
    if (search !== '') {
      const response = await this.api.search(search, page)
      const { movies, total, status } = response
      this.setState((state) => {
        return {
          ...state,
          movies: refreshRating(state.ratedMovies, movies),
          total,
          status,
        }
      })
    } else {
      this.setState((state) => {
        return {
          ...state,
          total: 0,
          movies: [],
          search,
          page: 1,
          status: 'none',
        }
      })
    }
  }

  render() {
    const { movies, total, page, status, genres, tabStatus, ratedMovies, ratedTotal, ratedPage } = this.state
    return (
      <GenresProvider value={genres}>
        <div className="movieListView">
          <Header
            onSearch={(search) => this.onSearch(search)}
            onTabChanged={(activeKey) => this.onTabChanged(activeKey)}
          />
          <ListFilm
            movies={tabStatus === 'search' ? movies : ratedMovies}
            onPage={(p) => this.onPage(p)}
            status={status}
            total={tabStatus === 'search' ? total : ratedTotal}
            page={tabStatus === 'search' ? page : ratedPage}
            onRating={(movieId, rating) => this.onRating(movieId, rating)}
          />
        </div>
      </GenresProvider>
    )
  }
}
