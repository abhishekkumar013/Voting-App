import { User } from '../model/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const approveAdminRequest = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError(401, 'No User Find')
    }
    user.role = 'admin'
    await user.save()

    return res.status(200).json(new ApiResponse(200, user, 'Request Acceppted'))
  } catch (error) {
    throw new ApiError(401, 'Try Again!')
  }
})
