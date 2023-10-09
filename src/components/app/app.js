import React, { Component } from 'react'

import { GenresProvider } from '../../services/genres-context'
import ApiMovieDB from '../../services/api-movie-db'
import './app.css'
import Header from '../header/header'
import ListFilm from '../films-list/films-list'
import refreshRating from '../../utils/refresh-rating'
import upsertRating from '../../utils/upsert-rating'

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
      ratings: [],
    }
    this.api = new ApiMovieDB()
  }

  async componentDidMount() {
    await this.api.createGuestSession()
    await this.getGenres()
    await this.getRatedMovies(1)
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
    const { tabStatus } = this.state
    if (tabStatus === 'search') {
      await this.setState((state) => {
        return {
          ...state,
          page,
          status: 'loading',
        }
      })
      const { search } = this.state
      this.fetch(search, page)
    } else {
      await this.setState((state) => {
        return {
          ...state,
          ratedPage: page,
        }
      })
      await this.getRatedMovies(page)
    }
  }

  async onRating(movieId, rating) {
    const rated = await this.api.postRating(movieId, rating)
    const { ratedPage } = this.state
    if (rated) {
      await this.setState((state) => {
        return {
          ...state,
          ratings: upsertRating(movieId, rating, state.ratings),
        }
      })
      setTimeout(() => this.getRatedMovies(ratedPage), 1000)
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

  async getRatedMovies(page) {
    const { movies: ratedMovies, total: ratedTotal } = await this.api.getRatedMovies(page)
    this.setState((state) => {
      return {
        ...state,
        status: 'success',
        movies: refreshRating(state.ratings, state.movies),
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
          movies: refreshRating(state.ratings, movies),
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
