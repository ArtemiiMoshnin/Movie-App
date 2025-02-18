import { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import { GenresConsumer } from '../services/service-genresContext';
import './movie.css';
import { Progress } from 'antd';
import PropTypes from 'prop-types';
import placeholderImage from '../img/images.png';

export default class Movie extends Component {
  formatDate = () => {
    const { movie } = this.props;
    if (!movie?.release_date) return '';
    return format(new Date(movie.release_date), 'MMMM d, yyyy');
  };

  shortenDescription = (description, maxLength) => {
    if (!description) return '';
    const words = description.split(' ').filter(Boolean);
    return words.length >= maxLength ? words.slice(0, maxLength).join(' ') + ' ...' : description;
  };

  getColor = (rating) => {
    if (rating < 3) return '#E90000';
    if (rating < 5) return '#E97E00';
    if (rating < 7) return '#E9D100';
    return '#66E900';
  };

  renderMovie = (genres) => {
    const { movie, savedRatings, onRatingChange } = this.props;
    const rating = savedRatings?.[movie.id]?.rating || 0;

    const genreNames = [];

    movie.genre_ids.forEach((id) => {
      const genre = genres.find((genre) => genre.id === id);
      if (genre) {
        genreNames.push(genre.name);
      }
    });

    return (
      <li className="movie">
        <div className="img-container">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : placeholderImage}
            alt={movie.title}
          />
        </div>

        <div className="movie-overview">
          <h1>{movie.original_title}</h1>
          <span className="time">{this.formatDate()}</span>
          <ul className="movie-genres">
            {genreNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="description-container">
          <p className="movie-description">{this.shortenDescription(movie.overview, 34)}</p>
        </div>

        <div className="movie-rating">
          <Progress
            type="circle"
            percent={movie.vote_average * 10}
            format={() => movie.vote_average.toFixed(1)}
            strokeColor={this.getColor(movie.vote_average)}
            size={30}
          />
        </div>

        <Rate
          value={rating}
          onChange={(starsValue) => {
            onRatingChange(movie.id, starsValue);
          }}
          allowHalf
          count={10}
          className="custom-rate"
        />
      </li>
    );
  };

  render() {
    return <GenresConsumer>{({ genres }) => this.renderMovie(genres)}</GenresConsumer>;
  }
}

Movie.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    release_date: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    poster_path: PropTypes.string,
    original_title: PropTypes.string,
    overview: PropTypes.string,
    vote_average: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  savedRatings: PropTypes.object.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};
