import { Component } from 'react';
import MovieList from './movieList';
import Pagination from 'antd/es/pagination';
import NoResults from './noResults';
import PropTypes from 'prop-types';

import './pagination.css';
import './page-container.css';

export default class RatedMovies extends Component {
  state = {
    ratedMovies: [],
    currentPage: 1,
  };

  componentDidMount() {
    const savedPage = this.props.tabPages['2'] || 1;
    this.setState({ currentPage: savedPage });
    this.loadRatedMovies();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.savedRatings !== this.props.savedRatings) {
      this.loadRatedMovies();
    }
  }

  loadRatedMovies = () => {
    const savedRatings = this.props.savedRatings || {};
    const ratedMovies = Object.values(savedRatings).filter((movie) => movie.rating);
    this.setState({ ratedMovies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      window.scrollTo(0, 0);
      const tabPages = { ...this.props.tabPages, 2: page };
      sessionStorage.setItem('tabPages', JSON.stringify(tabPages));
    });
  };

  render() {
    const { ratedMovies, currentPage } = this.state;
    const { savedRatings } = this.props;

    const pageSize = 20;

    const paginatedMovies = ratedMovies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
      <>
        {ratedMovies.length === 0 ? (
          <NoResults />
        ) : (
          <div className="page-container">
            <MovieList
              movies={paginatedMovies}
              savedRatings={savedRatings}
              onRatingChange={this.props.onRatingChange}
            />
            <div className="pagination">
              <Pagination
                current={currentPage}
                total={ratedMovies.length}
                pageSize={pageSize}
                onChange={this.handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
      </>
    );
  }
}

RatedMovies.propTypes = {
  tabPages: PropTypes.objectOf(PropTypes.number).isRequired,
  savedRatings: PropTypes.object.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};
