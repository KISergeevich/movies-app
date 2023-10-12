import React, { Component } from 'react'
import { message } from 'antd'

import { GenresProvider } from '../../services/genres-context'
import ApiMovieDB from '../../services/api-movie-db'
import './app.css'
import Header from '../header/header'
import ListFilm from '../films-list/movie-list'
import refreshRating from '../../utils/refresh-rating'
import upsertRating from '../../utils/upsert-rating'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      search: {
        status: 'none',
        search: '',
        page: 1,
        total: 0,
        items: [],
      },
      rated: {
        status: 'none',
        page: 1,
        items: [],
        total: 0,
      },
      ratings: [],
      genres: {
        status: 'none',
        genres: [],
      },
      tabStatus: 'search',
    }
    this.api = new ApiMovieDB()
  }

  async componentDidMount() {
    await this.api.createGuestSession()
    await this.getGenres()
    await this.getRatedMovies(1)
  }

  async onTabChanged(tab) {
    this.setState((state) => {
      return {
        ...state,
        tabStatus: tab,
      }
    })
    const { search, rated } = this.state
    if (tab === 'search') {
      this.search(search.search, search.page)
    } else {
      await this.getRatedMovies(rated.page)
    }
  }

  async onSearch(searchText) {
    await this.setState((state) => {
      return {
        ...state,
        search: {
          ...state.search,
          search: searchText,
          page: 1,
          status: 'loading',
        },
      }
    })
    const { search } = this.state
    this.search(searchText, search.page)
  }

  async onPage(page) {
    const { tabStatus } = this.state
    if (tabStatus === 'search') {
      await this.setState((state) => {
        return {
          ...state,
          search: {
            ...state.search,
            page,
            status: 'loading',
          },
        }
      })
      const { search } = this.state
      this.search(search.search, page)
    } else {
      await this.setState((state) => {
        return {
          ...state,
          rated: {
            ...state.rated,
            page,
            status: 'loading',
          },
        }
      })
      await this.getRatedMovies(page)
    }
  }

  async onRating(movieId, rating) {
    const result = await this.api.postRating(movieId, rating)
    const { rated } = this.state

    if (result) {
      message.success('Rating success')
      await this.setState((state) => {
        return {
          ...state,
          ratings: upsertRating(movieId, rating, state.ratings),
        }
      })
      setTimeout(() => this.getRatedMovies(rated.page), 1000)
    } else {
      message.error('Raiting failed')
    }
  }

  async getGenres() {
    const genres = await this.api.getGenres()
    this.setState((state) => ({
      ...state,
      genres: {
        ...state.genres,
        ...genres,
      },
    }))
  }

  async getRatedMovies(page) {
    this.setState((state) => ({
      ...state,
      rated: {
        ...state.rated,
        status: 'loading',
      },
    }))
    const { movies: ratedMovies, total: ratedTotal, status } = await this.api.getRatedMovies(page)
    this.setState((state) => ({
      ...state,
      rated: {
        ...state.rated,
        status,
        items: ratedMovies,
        total: ratedTotal,
      },
      search: {
        ...state.search,
        items: refreshRating(state.ratings, state.search.items),
      },
    }))
  }

  async search(search, page) {
    if (search !== '') {
      const response = await this.api.search(search, page)
      const { movies, total, status } = response
      this.setState((state) => {
        return {
          ...state,
          search: {
            ...state.search,
            items: refreshRating(state.ratings, movies),
            total,
            status,
          },
        }
      })
    } else {
      this.setState((state) => {
        return {
          ...state,
          search: {
            ...state.search,
            total: 0,
            items: [],
            search,
            page: 1,
            status: 'none',
          },
        }
      })
    }
  }

  render() {
    const { search, genres, tabStatus, rated } = this.state
    return (
      <GenresProvider value={genres}>
        <div className="movieListView">
          <Header onSearch={(searchText) => this.onSearch(searchText)} onTabChanged={(tab) => this.onTabChanged(tab)} />
          <ListFilm
            model={tabStatus === 'search' ? search : rated}
            onPage={(p) => this.onPage(p)}
            onRating={(movieId, rating) => this.onRating(movieId, rating)}
          />
        </div>
      </GenresProvider>
    )
  }
}
