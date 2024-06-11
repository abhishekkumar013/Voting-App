import mongoose from 'mongoose'

const VoterSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  voter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

export const Voter = mongoose.model('Voter', VoterSchema)
