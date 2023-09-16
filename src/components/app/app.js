import React, { Component } from 'react'

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
    }
    this.api = new ApiMovieDB()
  }

  async componentDidMount() {
    await this.api.createGuestSession()
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
    const { movies, total, page, status } = this.state
    return (
      <div className="movieListView">
        <Header onSearch={(search) => this.onSearch(search)} />
        <ListFilm movies={movies} onPage={(p) => this.onPage(p)} status={status} total={total} page={page} />
      </div>
    )
  }
}
