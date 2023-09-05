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
      status: 'none',
    }
    this.api = new ApiMovieDB()
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
    this.fetch()
  }

  async onPage(page) {
    await this.setState((state) => {
      return {
        ...state,
        page,
        status: 'loading',
      }
    })
    this.fecth()
  }

  async fetch() {
    const { search, page } = this.state
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
        <ListFilm movies={movies} status={status} />
        <div className="pagination">
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
      </div>
    )
  }
}
