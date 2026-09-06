require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Register = require('./models/register')


// -------- Basic middlewares for thhe API ----------
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

app.use(express.static('dist'))
app.use(express.json())
app.use(logger)

// -------- Valid API Routes ----------
app.get('/api/persons', (request, response) => {
  Register.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Register.findById(request.params.id)
    .then(register => {
      if (register) {
        response.json(register)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  Register.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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
    console.log('register saved!')
    response.json(result)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Register.findById(request.params.id)
    .then(register => {
      if (!register) {
        return response.status(404).end()
      }

      register.name = name
      register.number = number

      return register.save().then((updatedRegister) => {
        response.json(updatedRegister)
      })
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  Register.countDocuments({}).then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${Date().toString()}</p>
    `)
  })
})


// -------- Unknown Endpoint middleware ----------
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// -------- Error handler middleware ----------
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// handler of requests that result in errors
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
