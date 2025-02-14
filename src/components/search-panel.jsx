import { Component } from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import './search-panel.css';

export default class SearchPanel extends Component {
  state = {
    value: '',
  };

  debounceSearched = debounce((value) => {
    const { onSearch } = this.props;
    onSearch(value);
  }, 500);

  handleChange = (e) => {
    const newValue = e.target.value;
    this.setState({ value: newValue });
    this.debounceSearched(newValue);
  };

  render() {
    const { value } = this.state;
    return (
      <div className="search-bar-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Type to search..."
          onChange={this.handleChange}
          autoFocus
          value={value}
        />
      </div>
    );
  }
}

SearchPanel.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
