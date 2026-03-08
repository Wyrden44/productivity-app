import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

console.log('DB URL:', process.env.DATABASE_URL)
