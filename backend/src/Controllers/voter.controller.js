import mongoose from 'mongoose'
import { User } from '../model/user.model.js'
import { Voter } from '../model/voter.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Candidate } from '../model/candidates.js'

// vote dega
export const VotedController = asyncHandler(async (req, res) => {
  try {
    const { candidateId } = req.body
    const isVoted = await Voter.findById({ voter: req.user._id })
    if (isVoted) {
      throw new ApiError(401, 'Already Voted')
    }
    const vote = await Voter.create({
      candidate: new mongoose.Types.ObjectId(candidateId),
      voter: req.user._id,
    })
    if (!vote) {
      throw new ApiError(401, 'Try! Again')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, vote, 'Successfully Voted'))
  } catch (error) {
    throw new ApiError(500, 'Your Vote Not Counted! Try Again')
  }
})

export const UnVotedController = asyncHandler(async (req, res) => {
  try {
    const voterId = req.user._id

    const deletedVote = await Voter.findOneAndDelete({ voter: voterId })

    if (!deletedVote) {
      throw new ApiError(404, 'No Vote Found')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Successfully UnVoted! Please Vote Again'))
  } catch (error) {
    throw new ApiError(500, 'Try Again ')
  }
})

export const getAllCandidateVotesController = asyncHandler(async (req, res) => {
  try {
    const votes = await Voter.aggregate([
      {
        $group: {
          _id: '$candidate',
          voteCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidate',
        },
      },
      {
        $unwind: '$candidate',
      },
      {
        $project: {
          _id: 0,
          candidateId: '$_id',
          candidateName: '$candidate.name',
          candidateParty: '$candidate.party',
          voteCount: 1,
        },
      },
    ])
    if (votes.length === 0 || !votes) {
      return res.status(404).json(new ApiError(404, 'No Candidates Found'))
    }

    return res
      .status(200)
      .json(new ApiResponse(200, votes, 'Vote counts fetched successfully'))
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, 'Failed to fetch vote counts'))
  }
})

export const getCandidateVoteCountController = asyncHandler(
  async (req, res) => {
    try {
      const { candidateId } = req.params // Assuming candidateId is passed as a URL parameter

      const result = await Voter.aggregate([
        {
          $match: { candidate: mongoose.Types.ObjectId(candidateId) },
        },
        {
          $group: {
            _id: '$candidate',
            voteCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'candidates',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidate',
          },
        },
        {
          $unwind: '$candidate',
        },
        {
          $project: {
            _id: 0,
            candidateId: '$_id',
            candidateName: '$candidate.name',
            candidateParty: '$candidate.party',
            voteCount: 1,
          },
        },
      ])

      if (result.length === 0) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              'Candidate not found or no votes found for this candidate',
            ),
          )
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, result[0], 'Vote count fetched successfully'),
        )
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, 'Failed to fetch vote count'))
    }
  },
)
