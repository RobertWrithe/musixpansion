import React, { Component } from 'react';
import Axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      artistName: '',
      artistBio: '',
      artistSimilar: [],
      artistIcon: '',
      artistLink: '',
      ebayTest: '',
      ebayResults: [],
      ebayLink: '',
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
    console.log('key pressed');
    console.log(event.key);
    if(event.key === 'Enter'){
      console.log('Enter key pressed');
      this.searchArtist(this.state.userInput)
    }
  }

  searchArtist(input) {
    var query = input.replace(' ', '+').replace('&', 'and').replace('!', '').replace('?', '');

    Axios.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + query + '&api_key=c4f12db3382e08f679bedf5c5e91b891&format=json')
      .then((response) => {
        this.setState({
          artistName: response.data.artist.name,
          artistBio: response.data.artist.bio.summary.slice(0, response.data.artist.bio.summary.indexOf(' ', 72)) + '...',
          artistSimilar: response.data.artist.similar.artist,
          artistIcon: response.data.artist.image[2]['#text'],
          artistLink: response.data.artist.url,
          userInput: '',
          error: false
        })
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          error: true,
          artistName: '',
          artistBio: '',
          artistSimilar: [],
          artistIcon: '',
          artistLink: '',
          ebayTest: '',
          ebayResults: [],
          ebayLink: '',
          userInput: ''
        })
      });

    var ebayUrl = 'http://svcs.ebay.com/services/search/FindingService/v1';
    ebayUrl += '?OPERATION-NAME=findItemsByKeywords';
    ebayUrl += '&SERVICE-VERSION=1.0.0';
    ebayUrl += '&SECURITY-APPNAME=RobertBa-ArtistMe-PRD-593587284-6ac41d2e';
    ebayUrl += '&GLOBAL-ID=EBAY-US';
    ebayUrl += '&RESPONSE-DATA-FORMAT=JSON';
    ebayUrl += '&callback=_cb_findItemsByKeywords';
    ebayUrl += '&REST-PAYLOAD';
    ebayUrl += '&keywords=' + query;
    ebayUrl += '&paginationInput.entriesPerPage=6';

    Axios.get(ebayUrl)
      .then((response) => {
        this.setState({
          ebayTest: response.data.slice(response.data.lastIndexOf('http'), response.data.lastIndexOf('"]}]})')).replace(/\\/g, ''),
          ebayResults: JSON.parse(response.data.slice(response.data.indexOf('[{"itemId"'), response.data.lastIndexOf('}],"paginationOutput"'))),
          ebayLink: response.data.slice(response.data.lastIndexOf('http'), response.data.lastIndexOf('"]}]})')).replace(/\\/g, ''),
          error: false
        })
      })
      .catch((err) => { console.log(err) });

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
              className='search-bar'
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
