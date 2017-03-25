/**
 * Created by josh on 3/25/17.
 */

const addTorrentHandler = (request, response) => {
  const torrentName = request.query.torrentName;
  const torrentHash = request.query.torrentHash;

  response.send('torrent name -> ' + torrentName + 'and torrent hash is -> ' + torrentHash);
};

module.exports = addTorrentHandler;
