import { Component } from 'react';
import { Pagination, Tabs } from 'antd';
import RatedMovies from './components/RatedMovies';
import MovieList from './components/movieList';
import MovieApi from './services/movie-api-service';
import Spinner from './components/spinner';
import Error from './components/error';
import { Offline, Online } from 'react-detect-offline';
import NoResults from './components/noResults';
import { SwapiServiceProvider } from './services/service-contextId';
import SearchPanel from './components/search-panel';
import { GenresProvider } from './services/service-genresContext';
import './components/pagination.css';
import './components/page-container.css';

export default class App extends Component {
  movie = new MovieApi();

  state = {
    movies: [],
    loading: false,
    error: false,
    query: '',
    currentPage: 1,
    totalResults: 0,
    activeTab: sessionStorage.getItem('activeTab') || '1',
    tabPages: JSON.parse(sessionStorage.getItem('tabPages')) || { 1: 1, 2: 1 },
    savedRatings: JSON.parse(sessionStorage.getItem('savedRatings')) || {},
  };

  async componentDidMount() {
    const savedQuery = sessionStorage.getItem('query') || 'The way back';
    const activeTabPage = this.state.tabPages[this.state.activeTab] || 1;

    try {
      const sessionId = await this.movie.createGuestSession();
      this.setState({ guestSessionId: sessionId, query: savedQuery }, () =>
        this.updateMovies(this.state.query, activeTabPage)
      );
    } catch (error) {
      this.setState({ error: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeTab !== prevState.activeTab) {
      sessionStorage.setItem('activeTab', this.state.activeTab);
    }

    if (this.state.tabPages[this.state.activeTab] !== prevState.tabPages[this.state.activeTab]) {
      sessionStorage.setItem('tabPages', JSON.stringify(this.state.tabPages));
    }
  }

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  handleSearch = (query) => {
    sessionStorage.setItem('query', query);
    this.setState(
      (prevState) => ({
        query,
        currentPage: 1,
        tabPages: { ...prevState.tabPages, 1: 1 },
      }),
      () => this.updateMovies(query, 1)
    );
  };

  handlePageChange = (page) => {
    this.setState(
      (prevState) => {
        const tabPages = { ...prevState.tabPages, [prevState.activeTab]: page };
        return { currentPage: page, tabPages };
      },
      () => this.updateMovies(this.state.query, this.state.currentPage)
    );
  };

  handleTabChange = (key) => {
    this.setState(
      (prevState) => {
        const updatedTabPages = { ...prevState.tabPages, [key]: prevState.tabPages[key] || 1 };
        return { activeTab: key, currentPage: updatedTabPages[key], tabPages: updatedTabPages };
      },
      () => {
        const currentPage = this.state.tabPages[this.state.activeTab];
        this.updateMovies(this.state.query, currentPage);
      }
    );
  };

  updateMovies = (query, page = this.state.currentPage) => {
    this.setState({ loading: true });
    this.movie
      .getMovie(query, page)
      .then((res) => {
        this.setState({ movies: res.results || [], loading: false, totalResults: res.total_results || 0 });
      })
      .catch(this.onError);
  };

  handleRatingChange = (movieId, rating) => {
    const { movies, savedRatings } = this.state;

    const existingMovie = savedRatings[movieId];
    const movie = movies.find((m) => m.id === movieId) || existingMovie;

    if (!movie) return;

    const updatedMovie = { ...movie, rating };
    const updatedRatings = { ...savedRatings, [movieId]: updatedMovie };

    this.setState({ savedRatings: updatedRatings }, () => {
      sessionStorage.setItem('savedRatings', JSON.stringify(updatedRatings));
    });
  };

  render() {
    const { movies, loading, error, totalResults, guestSessionId, activeTab, tabPages, savedRatings } = this.state;
    if (loading) return <Spinner />;
    if (error) return <Error />;

    const tabItems = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div className="page-container">
            <SearchPanel onSearch={this.handleSearch} />
            {movies.length === 0 ? (
              <NoResults />
            ) : (
              <MovieList movies={movies} savedRatings={savedRatings} onRatingChange={this.handleRatingChange} />
            )}
            <div className="pagination">
              <Pagination
                current={tabPages['1']}
                total={totalResults}
                pageSize={20}
                onChange={this.handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        children: (
          <RatedMovies savedRatings={savedRatings} onRatingChange={this.handleRatingChange} tabPages={tabPages} />
        ),
      },
    ];

    return (
      <SwapiServiceProvider value={{ guestSessionId }}>
        <GenresProvider>
          <Offline>
            <Error />
          </Offline>
          <Online>
            <Tabs activeKey={activeTab} onChange={this.handleTabChange} items={tabItems} centered />
          </Online>
        </GenresProvider>
      </SwapiServiceProvider>
    );
  }
}
