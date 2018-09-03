const request = require('request');
const fs = require('fs');
const secrets = require('./secrets');

const repo = process.argv[3];
const owner = process.argv[2];

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
    .on('end', () => {
      console.log(`Downloaded avatar from: ${url}`);
    })
    .pipe(fs.createWriteStream(filePath));
}

const getAvatar = (err, data) => {
  if (err) {
    console.log(err);
  }
  data.forEach((obj) => {
    const file = `./downloads/${obj.login}.jpg`;
    const url = obj.avatar_url;
    downloadImageByURL(url, file);
  });
};

if (!(owner) || !(repo)) {
  console.log('User or Repo not specified!');
} else {
  getRepoContributors(owner, repo, getAvatar);
}
