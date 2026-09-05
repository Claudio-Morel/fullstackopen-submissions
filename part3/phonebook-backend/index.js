require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Register = require('./models/register')


const app = express()

morgan.token('body', (request) => {
  if (request.method !== 'POST') {
    return ''
  }

  return JSON.stringify(request.body)
})

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

app.use(express.json())
app.use(express.static('dist'))
app.use(logger)

// Function extracted from https://www.w3schools.com/JS/js_random.asp
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

app.get('/api/persons', (request, response) => {
  Register.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Register.findOne({ _id: id })
    .then(register => {
      if (register) {
        response.json(register)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  registry = registry.filter(register => register.id != id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const newRegister = new Register({
    name: body.name,
    number: body.number
  })

  newRegister.save().then(result => {
    console.log('note saved!')
    response.json(result)
  })
})

app.get('/api/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${registry.length} people</p>
    <p>${Date().toString()}</p>
  `);
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
