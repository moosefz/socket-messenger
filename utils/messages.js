// create message object including time of message using moment
const moment = require("moment");

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;