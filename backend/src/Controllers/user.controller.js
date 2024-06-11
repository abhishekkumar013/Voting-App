import { User } from '../model/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = await user.generateAccesstoken()

    // validation na chle  iss liye q ki  yaha password or bhut sara required field  pass nii kr rhe
    await user.save({ validateBeforeSave: false })

    return { accessToken }
  } catch (error) {
    throw new ApiError(500, 'Error In Token Generation')
  }
}

export const RegisterController = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, password, address, voterId } = req.body
    if (!name || !email || !phone || !password || !address || !voterId) {
      throw new ApiError(400, 'All Fields Required')
    }
    const Existinguser = await User.findOne({ $or: [{ email }, { voterId }] })
    if (Existinguser) {
      throw new ApiError(400, 'User Already Exists')
    }
    const user = await User.create({
      name,
      email,
      phone,
      password,
      address,
      voterId,
    })

    if (!user) {
      throw new ApiError(400, 'User Not Registered')
    }

    const createduser = await User.findById(user._id).select('-password ')
    if (!createduser) {
      return new ApiError(500, 'User Not Registered')
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createduser, 'Registered Successfull'))
  } catch (err) {
    console.log(`error in user registration - ${err}`)
    throw new ApiError(500, 'User Not Registered')
  }
})

export const LoginController = asyncHandler(async (req, res) => {
  const { email, voterId, password } = req.body
  try {
    if (!email && !voterId) {
      throw new ApiError('Email or VoterId Required')
    }
    if (!password) {
      throw new ApiError('Password Required')
    }

    const user = await User.findOne({ $or: [{ email }, { voterId }] })

    if (!user) {
      throw new ApiError(400, 'User Not Registered')
    }
    const match = await user.isPasswordCorrect(password)

    if (!match) {
      throw new ApiError(400, 'Invalid User Credentails')
    }

    const { accessToken } = await generateAccessAndRefreshToken(user._id)

    const loogedinUser = await User.findById(user._id).select('-password')

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loogedinUser, accessToken },
          'User logiin successfull',
        ),
      )
  } catch (error) {
    throw new ApiError(500, 'Error In Login')
  }
})

export const updateUserAccountController = asyncHandler(async (req, res) => {
  const { name, email, phone, address, voterId } = req.body
  try {
    if (
      [name, email, phone, address, voterId].some(
        (field) => field?.trim() === '',
      )
    ) {
      throw new ApiError(400, 'All Fields Required')
    }
    const updateData = {}
    updateData.name = name
    updateData.email = email
    updateData.phone = phone
    updateData.address = address
    updateData.voterId = voterId

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { updateData } },
      { new: true },
    ).select('-password')

    if (!user) {
      throw new ApiError(400, 'Accoout  not updated')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Account updated successfull'))
  } catch (error) {
    throw new ApiError(500, 'Error In Account Update')
  }
})

export const forgetPasswordConttroller = asyncHandler(async (req, res) => {
  const { password, newpassword } = req.body
  try {
    if (!password || !newpassword) {
      throw new ApiError(401, 'All fields required')
    }
    if (password !== newpassword) {
      throw new ApiError(401, 'Password and NewPassword Not match')
    }
    const user = await User.findById(req.user._id)
    const match = await user.isPasswordCorrect(password)
    if (!match) {
      throw new ApiError(401, 'Invalid User Cradentails')
    }
    user.password = newpassword
    await user.save({ validateBeforeSave: false })
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Password Updated Successfully'))
  } catch (error) {
    throw new ApiError(500, 'Error in password Updation')
  }
})
