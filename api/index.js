const animeapi = require('@justalk/anime-api');

module.exports = async (req, res) => {
  const { pathname, query } = new URL(req.url, `http://${req.headers.host}`);
  const q = query.q;
  const title = query.title;
  const ep = parseInt(query.ep);
  const website = query.website;

  if (pathname === '/api/search') {
    if (!q) return res.status(400).json({ error: 'Missing query parameter "q"' });
    try {
      const links = await animeapi.links(q, { limit: 5 });
      return res.status(200).json(links);
    } catch (err) {
      return res.status(500).json({ error: err.toString() });
    }
  }

  if (pathname === '/api/stream') {
    if (!title || isNaN(ep)) return res.status(400).json({ error: 'Missing or invalid "title" or "ep"' });
    try {
      const streams = await animeapi.stream(title, ep);
      return res.status(200).json(streams);
    } catch (err) {
      return res.status(500).json({ error: err.toString() });
    }
  }

  if (pathname === '/api/download') {
    if (!title || isNaN(ep)) return res.status(400).json({ error: 'Missing or invalid "title" or "ep"' });
    try {
      const downloads = await animeapi.download(title, ep, website ? { website } : {});
      return res.status(200).json(downloads);
    } catch (err) {
      return res.status(500).json({ error: err.toString() });
    }
  }

  return res.status(404).json({ error: 'Route not found.' });
};
