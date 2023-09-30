/* eslint-disable camelcase */
export default class ApiMovieDB {
  auth =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTExZjU5Yzg2NGJiZTA0ZTVkMTE2ZjVhNWJmYjFjYiIsInN1YiI6IjY0YWQwNzU5YjY4NmI5MDEyZjg4NjNmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A1OX3DUjFn8jWHt82mVoDiBy4-NohG23I3uQdXr7qYw'

  guestSessionId = undefined

  async createGuestSession() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.auth}`,
      },
    }
    const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options)
    const json = await response.json()
    const { success, guest_session_id } = json
    if (success) {
      this.guestSessionId = guest_session_id
    }
  }

  async getRatedMovies() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.auth}`,
      },
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${this.guestSessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`,
      options
    )
    const json = await response.json()
    const { results, total_results } = json
    return {
      movies: results,
      total: total_results,
      status: results.length !== 0 ? 'success' : 'empty',
    }
  }

  async postRating(movieId, rating) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.auth}`,
      },
      body: JSON.stringify({
        value: rating,
      }),
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${this.guestSessionId}`,
      options
    )
    if (response.ok) {
      return this.getRatedMovies()
    }
    return undefined
  }

  async getGenres() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.auth}`,
      },
    }
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    const json = await response.json()
    const { genres } = json
    return genres
  }

  async search(search, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.auth}`,
      },
    }
    let response
    try {
      response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`,
        options
      )
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
