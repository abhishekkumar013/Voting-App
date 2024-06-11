import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    rquired: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  voterId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter',
  },
  isvoted: {
    type: Boolean,
    default: false,
  },
})

userSchema.pre('save', async (next) => {
  if (!this.isModified('passwordd')) return next()

  this.password = bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async (password) => {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccesstoken = function () {
  return Jwt.sign(
    {
      // jo jo value jwt se access krna chahate h wo sb likh denge yaha
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  )
}

export const User = mongoose.model('User', userSchema)
