const axios = require('axios');
const cheerio = require('cheerio');

async function getProfileBio(platform, profileUrl) {
  const { data: html } = await axios.get(profileUrl, { timeout: 8000 });
  const $ = cheerio.load(html);

  switch (platform.toLowerCase()) {
    case 'instagram': {
      const meta = $('meta[name="description"]').attr('content');
      return meta || '';
    }

    case 'facebook': {
      const aboutText = $('div[data-pagelet="ProfileTilesFeed_0"]').text() ||
                        $('meta[name="description"]').attr('content');
      return aboutText || '';
    }

    case 'youtube': {
      const meta = $('meta[name="description"]').attr('content');
      return meta || '';
    }

    default:
      throw new Error('Unsupported platform');
  }
}

module.exports = { getProfileBio };