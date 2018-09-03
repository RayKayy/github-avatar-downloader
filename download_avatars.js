const request = require('request');
const fs = require('fs');
const secrets = require('dotenv').config().parsed;

// Check for correctly configured .env.
if (secrets === undefined) {
  throw new Error('.env file is missing');
} else if (secrets.GITHUB_TOKEN === undefined) {
  throw new Error('Missing GitHub token within .env file.');
}

// Check for correct number of arguments.
const args = process.argv.slice(2);

if (!(args.length === 2)) {
  throw new Error('Invalid number of arguments!');
}
const repo = args[0];
const owner = args[1];

console.log('Welcome to the GitHub Avatar Downloader!');

// Main function to retrieve avatar jpg from repo contributers.
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
    // Check if retrieval from API successful.
    if (data.message) {
      throw new Error(data.message);
    }
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
    throw err;
  }
  data.forEach((obj) => {
    const file = `./downloads/${obj.login}.jpg`;
    const url = obj.avatar_url;
    downloadImageByURL(url, file);
  });
};

// Run program based on parameters.
getRepoContributors(owner, repo, getAvatar);
