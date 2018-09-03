const request = require('request');
const fs = require('fs');
const secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'avatar-downloader',
      Authorization: `token ${secrets.GITHUB_TOKEN}`,
    },
  };
  request(options, (err, res, body) => {
    const data = JSON.parse(body);
    callback(err, data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('response', (response) => {
      console.log('Response Status Code: ', response.statusCode);
      console.log('Response Message: ', response.statusMessage);
      console.log('Response Content Type: ', response.headers['content-type']);
    })
    .pipe(fs.createWriteStream(filePath));
}

const getAvatar = (err, data) => {
  console.log(err);
  data.map((obj) => {
    const file = `./avatars/${obj.login}.jpg`;
    const url = obj.avatar_url;
    downloadImageByURL(url, file);
  });
};

getRepoContributors('jquery', 'jquery', getAvatar);
