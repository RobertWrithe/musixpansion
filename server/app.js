const express = require('express');
const app = express();
const Axios = require('axios');
let info = {
    ebay: {},
    lastfm: {}
};

app.use(express.json());

app.use(express.static('build'));

app.get('/api/:search', (req, res) => {
    Axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${req.params.search}&api_key=c4f12db3382e08f679bedf5c5e91b891&format=json`)
    .then(response => info.lastfm = response.data);
    let ebayUrl = `https://svcs.ebay.com/services/search/FindingService/v1`;
    ebayUrl += `?OPERATION-NAME=findItemsAdvanced`;
    ebayUrl += `&SERVICE-VERSION=1.0.0`;
    ebayUrl += `&SECURITY-APPNAME=RobertBa-ArtistMe-PRD-593587284-6ac41d2e`;
    ebayUrl += `&GLOBAL-ID=EBAY-US`;
    ebayUrl += `&RESPONSE-DATA-FORMAT=JSON`;
    ebayUrl += `&callback=_cb_findItemsByKeywords`;
    ebayUrl += `&REST-PAYLOAD`;
    ebayUrl += `&paginationInput.entriesPerPage=6`;
    ebayUrl += `&keywords=${req.params.search}`;
    ebayUrl += '&categoryId(0)=11233';
    ebayUrl += '&categoryId(1)=1';
    ebayUrl += '&categoryId(3)=45100';
    Axios.get(ebayUrl)
    .then(response => {info.ebay = response.data; res.send(info)})
  });

module.exports = app;