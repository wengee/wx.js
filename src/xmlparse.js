const xml2js = require('xml2js');

const formatMessage = function (result) {
  let message = {};
  result = result.xml || result;
  if (typeof result === 'object') {
    for (let key in result) {
      if (!(result[key] instanceof Array) || result[key].length === 0) {
        continue;
      }

      if (result[key].length === 1) {
        let val = result[key][0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        result[key].forEach(function (item) {
          message[key].push(formatMessage(item));
        });
      }
    }
    return message;
  } else {
    return result;
  }
}

exports.xmlParse = function (data) {
  return new Promise(function (resolve, reject) {
    xml2js.parseString(data, { trim: true }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        result = formatMessage(result);
        resolve(result);
      }
    })
  })
}
