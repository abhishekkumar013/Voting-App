import mongoose from 'mongoose'

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MOGODB_URL)

    console.log(
      `DATABASE CONNECTED Host  ${conn.connection.host} ${conn.connection.name}`,
    )
  } catch (error) {
    console.log(`Error in MongoDb ${error}`)
  }
}
export default dbConnect
