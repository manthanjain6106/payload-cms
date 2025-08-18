import 'dotenv/config'
import mongoose from 'mongoose'

const uri = process.env.DATABASE_URI

if (!uri) {
  console.error('DATABASE_URI is not set in .env')
  process.exit(1)
}

const timeoutMs = 10000

mongoose
  .connect(uri, { serverSelectionTimeoutMS: timeoutMs })
  .then(async () => {
    const { host, name: databaseName } = mongoose.connection
    try {
      const admin = mongoose.connection.db.admin()
      const info = await admin.serverStatus()
      console.log(
        JSON.stringify(
          {
            status: 'ok',
            host,
            databaseName,
            version: info?.version,
          },
          null,
          2,
        ),
      )
    } catch {
      console.log(
        JSON.stringify(
          {
            status: 'ok',
            host,
            databaseName,
          },
          null,
          2,
        ),
      )
    }
    await mongoose.disconnect()
    process.exit(0)
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })


