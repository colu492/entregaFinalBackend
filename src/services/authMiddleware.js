
// Middleware para autorizar a los usuarios con rol de admin
export const authorizeAdmin = (request, response, next) => {
    const user = request.session.user;
    if (user && user.role === 'admin') {
        next();
    } else {
        response.status(403).json({ message: 'Acceso denegado' })
    }
};

// Middleware para autorizar a los usuarios con rol de usuario regular
export const authorizeUser = (request, response, next) => {
    const user = request.session.user;
    if (user && user.role === 'user') {
        next();
    } else {
        response.status(403).json({ message: 'Acceso denegado' })
    }
};

// Middleware para autorizar a los usuarios con rol de premium o admin
export const authorizePremiumAdmin = (request, response, next) => {
    const user = request.session.user;
    if (user && (user.role === 'premium' || user.role === 'admin')) {
        next();
    } else {
        response.status(403).json({ message: 'Acceso denegado' })
    }
}

// Middleware para autorizar a los usuarios con rol de usuario o premium
export const authorizeUserPremium = (request, response, next) => {
    const user = request.session.user;
    if (user && (user.role === 'user' || user.role === 'premium')) {
        next();
    } else {
        response.status(403).json({ message: 'Acceso denegado' })
    }
};