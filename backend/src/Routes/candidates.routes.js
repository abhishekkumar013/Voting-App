import express from 'express'
import {
  CandidateAccountUpdate,
  CandidateForgetPassword,
  CandidateLoginController,
  RegisterCondidateController,
} from '../Controllers/candidates.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/singup').post(RegisterCondidateController)
router.route('/login').post(CandidateLoginController)

router.route('/account-update').patch(verifyJwt, CandidateAccountUpdate)
router.route('/forget-password').patch(verifyJwt, CandidateForgetPassword)
export default router
