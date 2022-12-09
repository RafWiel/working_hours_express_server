const path = require('path');
const {logger} = require('../misc/logger');

module.exports = {
  sendError(res, error) {
    logger.error(error);
    res.status(500).send({
      message: 'Błąd wewnętrzny serwera'
    });
  },
  sendBadRequestError(res, error) {
    logger.error(error);
    res.status(400).send({
      message: 'Nieprawidłowe dane wejściowe'
    });
  },
  sendDuplicateError(res, error) {
    logger.error(error);
    res.status(409).send({
      message: 'Wystąpił błąd: Duplikat\r\nZapis anulowany'
    });
  },
  sendAuthorizationError(res, error) {
    logger.error(error);
    res.status(401).send({
      message: 'Błąd autoryzacji'
    });
  },
  sendLoginError(res, error) {
    logger.error(error);
    res.status(401).send({
      message: 'Nieprawidłowy użytkownik lub hasło'
    });
  },
  getDir() {
    if (process.pkg) {
      return path.resolve(process.execPath + '/..');
    } else {
      return path.join(require.main ? require.main.path : process.cwd(), '..');
    }
  }
}
