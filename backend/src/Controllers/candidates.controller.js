import { Candidate } from '../model/candidates.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const generateAccessToken = async (userId) => {
  try {
    const candidate = await Candidate.findById(userId)

    const accessToken = await candidate.generateAccessToken()

    // validation na chle  iss liye q ki  yaha password or bhut sara required field  pass nii kr rhe
    await candidate.save({ validateBeforeSave: false })

    return { accessToken }
  } catch (error) {
    throw new ApiError(500, 'Error In Token Generation')
  }
}
export const RegisterCondidateController = asyncHandler(async (req, res) => {
  try {
    const { username, name, party, age, voterId, adharNumber } = req.body
    if (
      [name, party, age, voterId, adharNumber].some(
        (field) => field?.trim() === '',
      )
    ) {
      throw new ApiError(400, 'All fields are required')
    }
    const existingcandidate = await Candidate.findOne({
      $or: [{ username }, { voterId }, { adharNumber }],
    })
    if (existingcandidate) {
      throw new ApiError(401, 'Candidate Already Registered')
    }
    const createcandidate = await Candidate.create({
      username,
      name,
      party,
      age,
      voterId,
      adharNumber,
    })
    const candidate = await Candidate.findById(createcandidate._id).select(
      '-voterId -adharNumber',
    )
    if (!candidate) {
      throw new ApiError(401, 'Error in Registration')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, candidate, 'Registered Successfull'))
  } catch (error) {
    throw new ApiError(500, 'Error In Registration')
  }
})

export const CandidateLoginController = asyncHandler(async (req, res) => {
  try {
    const { username, adharNumber, password } = req.body
    if (!username && !adharNumber) {
      throw new ApiError(401, 'Provide usernamr or adharnumber')
    }
    if (!password) {
      throw new ApiError(401, 'Password is Required')
    }
    const iscandidate = await Candidate.findOne({
      $or: [{ username }, { adharNumber }],
    })
    if (!iscandidate) {
      throw new ApiError(401, 'Candidate Not Registered')
    }
    const match = await iscandidate.isPasswordCorrect(password)

    if (!match) {
      throw new ApiError(401, 'Invalid User Credentials')
    }
    const { accessToken } = await generateAccessToken(iscandidate._id)
    const candidate = await Candidate.findById(candidate._id).select(
      '-password -adharNumber -voterId',
    )
    const options = {
      httpOnly: true,
      secure: true,
    }
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .json(200, candidate, 'Login Successfull')
  } catch (error) {
    throw new ApiError(500, 'Error In Login')
  }
})

export const CandidateAccountUpdate = asyncHandler(async (req, res) => {
  try {
    const { username, name, party, age, voterId, adharNumber } = req.body

    if (
      [username, name, party, age, voterId, adharNumber].some(
        (field) => field?.trim() === '',
      )
    ) {
      throw new ApiError(401, 'All Fields Required')
    }
    const checkusername = await Candidate.findOne({ username })
    if (checkusername) {
      throw new ApiError(401, 'User Name Already Exists')
    }
    const updateData = {}
    updateData.username = username
    updateData.name = name
    updateData.party = party
    updateData.age = age
    updateData.voterId = voterId
    updateData.adharNumber = adharNumber

    const user = await Candidate.findByIdAndUpdate(
      req.user._id,
      { $set: { updateData } },
      { new: true },
    ).select('-password -adharNumber -voterId')

    if (!user) {
      throw new ApiError(401, 'Error In Account Updation')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Account Updated Successfull'))
  } catch (error) {
    throw new ApiError(500, 'Error In Acoount Updation')
  }
})

export const CandidateForgetPassword = asyncHandler(async (req, res) => {
  try {
    const { password, newPassword } = req.body
    if (!password || !newPassword) {
      throw new ApiError(401, 'All fields required')
    }
    if (password !== newPassword) {
      throw new ApiError(401, 'Password and NewPassword must be same')
    }
    const user = await Candidate.findById(req.user._id)
    const match = await user.isPasswordCorrect(password)
    if (!match) {
      throw new ApiError(401, 'Invalid User Cradentails')
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Password Updated Successfully'))
  } catch (error) {
    throw new ApiError(500, 'Error In Foret Password')
  }
})
