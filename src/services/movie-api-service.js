export default class MovieApi {
  baseUrl = 'https://api.themoviedb.org/3/search/movie';
  apiKey = import.meta.env.VITE_API_KEY;

  async getResource(query, page) {
    const res = await fetch(
      `${this.baseUrl}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}&api_key=${this.apiKey}`
    );

    if (!res.ok) {
      throw new Error(`${res.status}`);
    }

    return res.json();
  }

  async createGuestSession() {
    const response = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();
    const guestId = data.guest_session_id;
    return guestId;
  }

  getMovie(query, page = 1) {
    return this.getResource(query, page).then((res) => res);
  }
}
