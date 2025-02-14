import { Component } from 'react';
import Movie from './movie';
import PropTypes from 'prop-types';
import './movieList.css';

export default class MovieList extends Component {
  render() {
    const { movies, savedRatings, onRatingChange } = this.props;

    return (
      <ul className="movie-list">
        {movies.map((movie) => {
          return <Movie key={movie.id} movie={movie} savedRatings={savedRatings} onRatingChange={onRatingChange} />;
        })}
      </ul>
    );
  }
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired, // Массив объектов (мои фильмы)
  savedRatings: PropTypes.object.isRequired, // Объект с сохраненными оценками
  onRatingChange: PropTypes.func.isRequired, // Функция изменения рейтинга
};
