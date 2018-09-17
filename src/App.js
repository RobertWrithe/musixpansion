import React, { Component } from 'react';
import Axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artistBio: '',
      artistIcon: '',
      artistLink: '',
      artistName: '',
      artistSimilar: [],
      ebayLink: '',
      ebayResults: [],
      error: false,
      userInput: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.searchArtist = this.searchArtist.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleKeyPress(event) {
    event.preventDefault();
    if (event.key === 'Enter') {
      this.searchArtist(this.state.userInput)
    }
  }

  searchArtist(input) {
    var query = input.replace(' ', '+').replace('&', 'and').replace('!', '').replace('?', '');
    Axios.get(`/api/${query}`)
      .then((response) => {
        this.setState({
          artistBio: response.data.lastfm.artist.bio.summary.slice(0, response.data.lastfm.artist.bio.summary.indexOf(' ', 72)) + '...',
          artistIcon: response.data.lastfm.artist.image[2]['#text'],
          artistLink: response.data.lastfm.artist.url,
          artistName: response.data.lastfm.artist.name,
          artistSimilar: response.data.lastfm.artist.similar.artist,
          ebayLink: response.data.ebay.slice(response.data.ebay.lastIndexOf('http'), response.data.ebay.lastIndexOf('"]}]})')).replace(/\\/g, ''),
          ebayResults: JSON.parse(response.data.ebay.slice(response.data.ebay.indexOf('[{"itemId"'), response.data.ebay.lastIndexOf('}],"paginationOutput"'))),
          error: false,
          userInput: ''
        })
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          artistBio: '',
          artistIcon: '',
          artistLink: '',
          artistName: '',
          artistSimilar: [],
          ebayLink: '',
          ebayResults: [],
          error: true,
          userInput: ''
        })
      });
  }

  render() {
    return (
      <div className='app'>
        <div className='app-header'><strong>musixpansion</strong></div>
        <div id='app-tagline' className='app-tagline'>expand your music collection</div>
        <div className='app-body'>
          <div className='search-bar'>
            <input
              type='text'
              ref={this.myRef}
              id='userInput'
              name='userInput'
              placeholder='Search for musician, band, or any recording artist...'
              value={this.state.userInput}
              onChange={this.handleChange}
              onKeyUp={this.handleKeyPress}
            />
            <button
              type='submit'
              id='searchArtist'
              name='searchArtist'
              onChange={this.handleChange}
              onClick={() => this.searchArtist(this.state.userInput)}>Search</button>
          </div>
          {this.state.artistName !== '' &&
            <div id='artist-results' className='artist-results'>
              <div id='artist-container' className='artist-grid-container'>
                <div id='artist-picture' className='artist-item1'>
                  <img src={this.state.artistIcon} alt={this.state.artistName} height='80'></img>
                </div>
                <div id='artist-name' className='artist-item2'><h1>{this.state.artistName}</h1></div>
                <div id='artist-bio' className='artist-item3'>{this.state.artistBio.slice(0, 1) === ' ' ? 'No summary avaliable...' : this.state.artistBio}<a href={this.state.artistLink}>[read more]</a></div>
              </div>
              <div id='ebay-results' className='ebay-grid-container'>
                <div id='ebay-header' className='ebay-header'>
                  eBay Search Results
                </div>
                {this.state.ebayResults.map((item) =>
                  <div key={this.state.ebayResults.indexOf(item)}>
                    <a href={item.viewItemURL}>
                      <img src={!item.galleryURL ? 'https://ir.ebaystatic.com/pictures/aw/pics/nextGenVit/imgNoImg.gif' : item.galleryURL} alt='eBay Item' height='120'></img>
                    </a>
                    <a href={item.viewItemURL}>
                      {item.title}
                    </a>
                  </div>
                )}
                <div id='ebay-link' className='ebay-link'>
                  <a href={this.state.ebayLink} className='ebay-title'>view more search results on eBay</a>
                </div>
              </div>
              {this.state.artistSimilar.length > 0 &&
                <div id='related-artists' className='related-artists'>
                  Related Artists:
                <button type='button' onClick={() => this.searchArtist(this.state.artistSimilar[0]['name'])}>
                    <strong>{this.state.artistSimilar[0]['name']}</strong>
                  </button>
                  <button type='button' onClick={() => this.searchArtist(this.state.artistSimilar[1]['name'])}>
                    <strong>{this.state.artistSimilar[1]['name']}</strong>
                  </button>
                  <button type='button' onClick={() => this.searchArtist(this.state.artistSimilar[2]['name'])}>
                    <strong>{this.state.artistSimilar[2]['name']}</strong>
                  </button>
                </div>
              }
            </div>
          }
          {this.state.error &&
            <div>
              <p>Either the artist you entered does not exist or you typed the name wrong. Please try again.</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
