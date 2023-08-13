/* eslint-disable camelcase */
export default class ApiMovieDB {
  auth =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTExZjU5Yzg2NGJiZTA0ZTVkMTE2ZjVhNWJmYjFjYiIsInN1YiI6IjY0YWQwNzU5YjY4NmI5MDEyZjg4NjNmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A1OX3DUjFn8jWHt82mVoDiBy4-NohG23I3uQdXr7qYw'

  async search(search, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.auth}`,
      },
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${page}`,
      options
    )
    if (!response.ok) {
      throw new Error(`Could not fetch, received ${response.status}`)
    }
    const json = await response.json()
    const { results, total_results } = json
    return {
      movies: results,
      total: total_results,
    }
  }
}
