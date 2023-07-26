import React, { Component } from 'react'

import './app.css'
import Header from '../header/header'
import Search from '../search-line/search-line'
import ListFilm from '../films-list/films-list'

export default class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <section>
        <Header />
        <Search />
        <ListFilm />
      </section>
    )
  }
}
