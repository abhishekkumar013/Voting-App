import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../model/user.model.js'

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization').replace('Bearer', '')

    if (!token) {
      throw new ApiError(401, 'Unauthorized request')
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decode?._id).select('-password')
    if (!user) {
      throw new ApiError(401, 'Invalid Access Token')
    }
    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access Token')
  }
})
