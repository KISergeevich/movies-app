/* eslint-disable camelcase */
export default class ApiMovieDB {
  auth =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTExZjU5Yzg2NGJiZTA0ZTVkMTE2ZjVhNWJmYjFjYiIsInN1YiI6IjY0YWQwNzU5YjY4NmI5MDEyZjg4NjNmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A1OX3DUjFn8jWHt82mVoDiBy4-NohG23I3uQdXr7qYw'

  apiKey = '1111f59c864bbe04e5d116f5a5bfb1cb'

  guestSessionId = undefined

  baseUrl = 'https://api.themoviedb.org/3/'

  async createGuestSession() {
    const localStorageGuestSessionId = localStorage.getItem('guestSessionId')
    if (localStorageGuestSessionId === undefined || localStorageGuestSessionId === null) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      }
      const newSessionUrl = new URL('authentication/guest_session/new', this.baseUrl)
      newSessionUrl.searchParams.set('api_key', this.apiKey)
      const response = await fetch(newSessionUrl, options)
      const json = await response.json()
      const { success, guest_session_id } = json
      if (success) {
        this.guestSessionId = guest_session_id
        localStorage.setItem('guestSessionId', this.guestSessionId)
      }
    } else {
      this.guestSessionId = localStorageGuestSessionId
    }
  }

  async getRatedMovies(page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    }
    let response
    try {
      const getRatedMoviesUrl = new URL(`guest_session/${this.guestSessionId}/rated/movies`, this.baseUrl)
      getRatedMoviesUrl.searchParams.set('api_key', this.apiKey)
      getRatedMoviesUrl.searchParams.set('language', 'en-US')
      getRatedMoviesUrl.searchParams.set('page', page)
      getRatedMoviesUrl.searchParams.set('sort_by', 'created_at.asc')
      response = await fetch(getRatedMoviesUrl, options)
    } catch {
      return {
        movies: [],
        total: 0,
        status: 'noInternet',
      }
    }
    if (!response.ok) {
      return {
        movies: [],
        total: 0,
        status: 'failed',
      }
    }
    const json = await response.json()
    const { results, total_results, total_pages } = json
    return {
      movies: results,
      total: total_results,
      totalPages: total_pages,
      status: results.length !== 0 ? 'success' : 'empty',
    }
  }

  async postRating(movieId, rating) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    }
    let response
    try {
      const postRatingUrl = new URL(`movie/${movieId}/rating`, this.baseUrl)
      postRatingUrl.searchParams.set('api_key', this.apiKey)
      postRatingUrl.searchParams.set('guest_session_id', this.guestSessionId)
      response = await fetch(postRatingUrl, options)
    } catch {
      return false
    }
    if (!response.ok) {
      return false
    }
    const json = await response.json()
    const { success } = json
    return success
  }

  async getGenres() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    let response
    try {
      const getGenresUrl = new URL('genre/movie/list', this.baseUrl)
      getGenresUrl.searchParams.set('api_key', this.apiKey)
      getGenresUrl.searchParams.set('language', 'en')
      response = await fetch(getGenresUrl, options)
    } catch {
      return {
        status: 'noInternet',
        genres: [],
      }
    }
    if (!response.ok) {
      return {
        status: 'failed',
        genres: [],
      }
    }
    const json = await response.json()
    const { genres } = json
    return {
      status: 'success',
      genres,
    }
  }

  async search(search, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    let response
    try {
      const searchUrl = new URL('search/movie', this.baseUrl)
      searchUrl.searchParams.set('api_key', this.apiKey)
      searchUrl.searchParams.set('query', search)
      searchUrl.searchParams.set('include_adult', false)
      searchUrl.searchParams.set('language', 'en-US')
      searchUrl.searchParams.set('page', page)
      response = await fetch(searchUrl, options)
    } catch {
      return {
        movies: [],
        total: 0,
        status: 'noInternet',
      }
    }
    if (!response.ok) {
      return {
        movies: [],
        total: 0,
        status: 'failed',
      }
    }
    const json = await response.json()
    const { results, total_results } = json
    return {
      movies: results,
      total: total_results,
      status: results.length !== 0 ? 'success' : 'empty',
    }
  }
}
