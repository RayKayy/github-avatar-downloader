const request = require('request');
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
    callback(err, body);
  });
}

getRepoContributors('jquery', 'jquery', (err, res) => {
  console.log('Errors:', err);
  console.log('Result:', res);
});
