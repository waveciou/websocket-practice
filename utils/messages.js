const day = require('dayjs');

function formatMessages(username, text) {
  return {
    username,
    text,
    time: day().format('h:mm a')
  }
};

module.exports = formatMessages;