import { config } from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import ingredients from './routes/ingredients/ingredients.routes'
import operations from './routes/operations/operations.routes'
import pizzas from './routes/pizzas/pizzas.routes'
import { mongoDb } from './shared/mongoDbUrl'

config()
const app = express()


const localhost = process.env.ORIGIN
const { MONGO_CONNECTED_STRING } = process.env

const mongoConnectionString = MONGO_CONNECTED_STRING ?? mongoDb.url

const corsOptions = {
	origin: localhost,
	credentials: true,
}

mongoose.connect(mongoConnectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

const database = mongoose.connection

database.on('error', (error) => {
	console.log(error)
})

database.once('connected', () => {
	console.log('Database Connected')
})

app.set('Access-Control-Allow-Credentials', true)
app.use(cors(corsOptions))
app.use(express.json())
app.use(ingredients)
app.use(operations)
app.use(pizzas)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`)
})
