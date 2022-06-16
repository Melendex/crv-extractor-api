const mongoose = require('mongoose')
const validador = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userProcedureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!(validador.isEmail(value))) {
                throw new Error('Correo electronico no valido..')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        validate(pass) {
            if (!(validador.isLength(pass, { min: 6 }))) {
                throw new Error('Longitud minimo 6 ')
            }

        }
    },
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }]

}, { timestamps: true })

userProcedureSchema.pre('save', async function(next) {
    const signup = this

    if (signup.isModified('password')) {
        signup.password = await bcrypt.hash(signup.password, 8)
    }

    next();
})


userProcedureSchema.methods.generateAuthToken = async function() {
    const user = this

    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 5);

    const jwt_secret_key = process.env.JWT_SECRET_KEY
    const token = jwt.sign({ _id: user._id.toString(), expires_at }, jwt_secret_key)

    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

userProcedureSchema.methods.toJSON = function() {
    const user = this

    const userPublic = user.toObject()

    delete userPublic._id;
    delete userPublic.password
    delete userPublic.__v

    return userPublic
}

userProcedureSchema.statics.findUserByCredentials = async(email, password) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('No puede logearse...')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('No puede logearse...')
    }

    return user
}

const User = mongoose.model('UserProcedure', userProcedureSchema)

module.exports = User