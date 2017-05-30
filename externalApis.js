const argv = require('yargs').argv;
const fs = require('fs');
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const client = rest.wrap(mime);
const nzbsKey = process.env.nzbsKey;
const searchQuery = argv._[0];
const { find, get } = require('lodash');

const nzbs = {
    search: function(query, categoryCode, apiKey) {
        const requestPath = encodeURI(`http://nzbs.org/api?t=search&cat=${categoryCode}&attrs=grabs,video&q=${query}&apikey=${apiKey}&o=json`);
        return rest({
            mixin: { rejectUnauthorized: false },
            method: 'GET',
            path: requestPath,
        }).then(response => {
            fs.writeFileSync(`${query}.json`, response.entity);
            return JSON.parse(response.entity);
        });
    },

    searchForFilm: function(query, apiKey) {
        return this.search(query, '2000', apiKey);
    },

    searchForTv: function(query, apiKey) {
        return this.search(query, '5000', apiKey);
    },

    download: function(title, downloadId, apiKey) {
        return client({
            mixin: { rejectUnauthorized: false },
            method: 'POST',
            path: `http://nzbs.org//getnzb?i=7344&r=${apiKey}&id=${downloadId}`
        }).then(response => {
            fs.writeFileSync(`${title}.nzb`, response.entity);
            return;
        });
    }
}

const nzbUtils = {
    createGrabResults: (searchResults) => {
        const resultsWithGrabs = [];

        searchResults.channel.item.forEach(item => {
            const availableAttributes = item.attr;
            const grabsObject = find(availableAttributes, attribute => {
                if (attribute["@attributes"].name === 'grabs') {
                    return attribute["@attributes"].value;
                }
            });
            resultsWithGrabs.push({name : item.title, guid: item.guid, link: item.link, grabs: parseInt(grabsObject['@attributes'].value)});
        });
        return resultsWithGrabs;
    },
    sortResults: function(resultsWithGrabs) {
        return resultsWithGrabs.sort(function(a,b) {
            return b.grabs - a.grabs;
        });
    }
}

nzbs.searchForFilm(searchQuery, nzbsKey).then(res => {
    const withGrabResults = nzbUtils.createGrabResults(res);
    const sortedResults = nzbUtils.sortResults(withGrabResults);
    return sortedResults;
}).then(res => {
    return nzbs.download(res[0].name, res[0].guid, nzbsKey);
});
