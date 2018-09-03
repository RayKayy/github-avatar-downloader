const request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // ...
}

getRepoContributors('jquery', 'jquery', (err, res) => {
  console.log('Errors:', err);
  console.log('Result:', res);
});
