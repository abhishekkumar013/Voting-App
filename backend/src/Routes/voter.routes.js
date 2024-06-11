import express from 'express'
import {
  UnVotedController,
  VotedController,
  getAllCandidateVotesController,
  getCandidateVoteCountController,
} from '../Controllers/voter.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/').post(verifyJwt, VotedController)

router.route('/unvote').patch(verifyJwt, UnVotedController)
router.route('/candidates/votes').get(verifyJwt, getAllCandidateVotesController)

router
  .route('/candidate/vote-count/:candidateId')
  .get(verifyJwt, getCandidateVoteCountController)

export default router
