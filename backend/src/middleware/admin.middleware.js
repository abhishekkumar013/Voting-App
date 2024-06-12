import { User } from '../model/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const isAdmin = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user || user?.role !== 'admin') {
      throw new ApiError(403, 'Access denied')
    }
    // req.user = user
    next()
  } catch (error) {
    throw new ApiError(500, 'unAuthorized Access')
  }
})
export default isAdmin
