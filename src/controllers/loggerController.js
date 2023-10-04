import logger from '../services/logger.js';


// Probando el logger
const loggerController = {
    testLogger(request, response) {
        logger.debug('Esto es un mensaje de nivel debug');
        logger.http('Esto es un mensaje de nivel http');
        logger.info('Esto es un mensaje de nivel info');
        logger.warning('Esto es un mensaje de nivel warning');
        logger.error('Esto es un mensaje de nivel error');
        logger.fatal('Esto es un mensaje de nivel fatal');

        return response.status(200).json({ message: 'Prueba de log completada'});
    }
}

export default loggerController