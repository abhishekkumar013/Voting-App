import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const CandidateSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  voterId: {
    type: String,
    required: true,
  },
  adharNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // votes: [
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'User',
  //     },
  //     votedAt: {
  //       type: Date,
  //       default: Date.now(),
  //     },
  //   },
  // ],
  // voteCount: {
  //   type: Number,
  //   default: 0,
  // },
})
CandidateSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
})
CandidateSchema.method.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}
CandidateSchema.method.generateAccessToken = async function () {
  return jwt.sign(
    { _id: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  )
}

export const Candidate = mongoose.model('Candidate', CandidateSchema)
