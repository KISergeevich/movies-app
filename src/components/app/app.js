import React, { Component } from 'react'

import { GenresProvider } from '../../services/genres-context'
import ApiMovieDB from '../../services/api-movie-db'
import './app.css'
import Header from '../header/header'
import ListFilm from '../films-list/films-list'

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
    }
    this.api = new ApiMovieDB()
  }

  async componentDidMount() {
    await this.api.createGuestSession()
    const genres = await this.api.getGenres()
    this.setState((state) => {
      return {
        ...state,
        genres,
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

  onRating(movieId, rating) {
    this.api.postRating(movieId, rating)
  }

  async fetch(search, page) {
    if (search !== '') {
      const response = await this.api.search(search, page)
      const { movies, total, status } = response
      this.setState((state) => {
        return {
          ...state,
          movies,
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
    const { movies, total, page, status, genres } = this.state
    return (
      <GenresProvider value={genres}>
        <div className="movieListView">
          <Header onSearch={(search) => this.onSearch(search)} />
          <ListFilm
            movies={movies}
            onPage={(p) => this.onPage(p)}
            status={status}
            total={total}
            page={page}
            onRating={(movieId, rating) => this.onRating(movieId, rating)}
          />
        </div>
      </GenresProvider>
    )
  }
}
