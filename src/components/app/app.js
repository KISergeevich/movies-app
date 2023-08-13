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
    }
    this.api = new ApiMovieDB()
  }

  onSearch(search) {
    this.setState((state) => {
      return {
        ...state,
        search,
        page: 1,
      }
    })
    const { page } = this.state
    const response = this.api.search(search, page)
    const { movies, total } = response
    this.setState((state) => {
      return {
        ...state,
        movies,
        total,
      }
    })
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  onPage(page) {
    this.setState((state) => {
      return {
        ...state,
        page,
      }
    })
    const { search } = this.state
    const response = this.api.search(search, page)
    const { movies, total } = response
    this.setState((state) => {
      return {
        ...state,
        movies,
        total,
      }
    })
  }

  render() {
    const { movies } = this.state
    return (
      <section className="">
        <Header onSearch={(search) => this.onSearch(search)} />
        <ListFilm movies={movies} />
      </section>
    )
  }
}
