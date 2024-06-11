import express from 'express'

import { verifyJwt } from '../middleware/auth.middleware.js'
import {
  forgetPasswordConttroller,
  updateUserAccountController,
  LoginController,
  RegisterController,
} from '../Controllers/user.controller.js'

const router = express.Router()

router.route('/singup').post(RegisterController)
router.route('/login').post(LoginController)

router.route('/update-account').patch(verifyJwt, updateUserAccountController)
router.route('/forget-password').patch(verifyJwt, forgetPasswordConttroller)

export default router
