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

const getAvatarUrl = (err, data) => {
  console.log(err);
  data.map((obj) => {
    console.log(obj.avatar_url);
    return obj.avatar_url;
  });
};

getRepoContributors('jquery', 'jquery', getAvatarUrl);
downloadImageByURL('https://avatars0.githubusercontent.com/u/1615?v=4', './avatar.jpg');
