/* eslint-disable camelcase */
export default class ApiMovieDB {
  auth =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTExZjU5Yzg2NGJiZTA0ZTVkMTE2ZjVhNWJmYjFjYiIsInN1YiI6IjY0YWQwNzU5YjY4NmI5MDEyZjg4NjNmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A1OX3DUjFn8jWHt82mVoDiBy4-NohG23I3uQdXr7qYw'

  guestSessionID = undefined

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
      this.guestSessionID = guest_session_id
    }
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
