import winston from "winston";

// Logger de Winston con niveles personalizados
const logger = winston.createLogger({
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    // Configuración de los transportes (dónde se registran los mensajes)
    transports: [
        new winston.transports.Console({
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level:'error'
        })
    ]
})

export default logger 