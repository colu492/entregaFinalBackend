import passport from "passport";
import local from 'passport-local'
import userModel from "../models/user.model.js";
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from "../utils.js";
import config from "./config.js";
import cartModel from "../models/carts.model.js"

// Estrategia
const LocalStrategy = local.Strategy

// Inicializar Passport
const initializePassport = () => {

    //Registro de nuevos usuarios
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (request, username, password, done) => {
        const { first_name, last_name, age, email } = request.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('Ya existe este usuario')
                return done(null, false)
            }

            console.log('Creando nuevo usuario...')

            //Carrito para el nuevo usuario
            const cartForNewUser = await cartModel.create({})
            const newUser = {
                first_name, last_name, age, email,
                password: createHash(password),
                cart: cartForNewUser._id,
            }

            // Nuevo usuario en la BD
            const result = await userModel.create(newUser)

            console.log('Nuevo usuario creado:', result)
            return done(null, result)
        } catch (err) {
            console.error('Error en el Registro:', err)
            return done('Error en passport: ' + err.message)
        }
    }))

    //Login de usuarios
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log('Usuario no existente')
                return done(null, user)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        } catch (error) {
            done('error')
        }
    }))

    // Login con GitHub
    passport.use('github', new GitHubStrategy({
        clientID: config.clientid,
        clientSecret: config.client_secret,
        callbackURL: config.callback_url,
    }, async (accessToken, refreshTokem, profile, done) => {

        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }                       
            
            // Carrito para el nuevo usuario de GitHub
            const cartForNewUser = await cartModel.create({})
            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: profile._json.name,
                age: 0,
                email: profile._json.email,
                password: " ",
                cart: cartForNewUser._id,
                role: 'premium'
            })
            return done(null, newUser)
        } catch (err) {
            return done('Error al logear con Github')
        }
    }))

    // Serializa el usuario para almacenarlo en la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // Deserializa el usuario a partir de su identificador
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport