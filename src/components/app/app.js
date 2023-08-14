import React, { Component } from 'react'
import { Pagination } from 'antd'

import ApiMovieDB from '../../services/api-movie-db'
import './app.css'
import Header from '../header/header'
import ListFilm from '../films-list/movie-list'

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

  async onSearch(search) {
    this.setState((state) => {
      return {
        ...state,
        search,
        page: 1,
      }
    })
    const { page } = this.state
    const response = await this.api.search(search, page)
    const { movies, total } = response
    this.setState((state) => {
      return {
        ...state,
        movies,
        total,
      }
    })
  }

  async onPage(page) {
    this.setState((state) => {
      return {
        ...state,
        page,
      }
    })
    const { search } = this.state
    const response = await this.api.search(search, page)
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
    const { movies, total, page } = this.state
    return (
      <div className="">
        <Header onSearch={(search) => this.onSearch(search)} />
        <ListFilm movies={movies} />
        <Pagination
          defaultCurrent={1}
          total={total}
          onChange={(p) => this.onPage(p)}
          hideOnSinglePage
          pageSize={20}
          current={page}
          showSizeChanger={false}
        />
      </div>
    )
  }
}
