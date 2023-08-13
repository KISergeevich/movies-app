import React, { Component } from 'react'

import ApiMovieDB from '../../services/api-movie-db'
import './app.css'
import Header from '../header/header'
import ListFilm from '../films-list/films-list'

export default class App extends Component {
  constructor() {
    super()
    this.state = {}
    this.api = new ApiMovieDB()
  }

  onSearch(search) {
    this.api.search(search)
  }

  render() {
    return (
      <section className="">
        <Header onSearch={(search) => this.onSearch(search)} />
        <ListFilm />
      </section>
    )
  }
}
