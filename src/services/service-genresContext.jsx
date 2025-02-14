import React, { Component } from 'react';
import PropTypes from 'prop-types';

const apiKey = '9dba2b36ccc415bd7afa35b8652889e4';

const { Provider, Consumer } = React.createContext({
  genres: [],
});

class GenresProvider extends Component {
  state = {
    genres: [],
  };

  componentDidMount() {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ genres: data.genres });
      })
      .catch((error) => console.error('Ошибка загрузки жанров:', error));
  }
  render() {
    return <Provider value={{ genres: this.state.genres }}>{this.props.children}</Provider>;
  }
}

GenresProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GenresProvider, Consumer as GenresConsumer };
