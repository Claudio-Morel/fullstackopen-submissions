const express = require('express')
const morgan = require('morgan')


const app = express()
app.use(express.json())

morgan.token('body', (request) => {
  if (request.method !== 'POST') {
    return ''
  }

  return JSON.stringify(request.body)
})

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

app.use(logger)

// Function extracted from https://www.w3schools.com/JS/js_random.asp
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

let registry = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(registry)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const register = registry.find(register => register.id === id)
  if (register) {
    response.json(register)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  registry = registry.filter(register => register.id != id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const newRegister = request.body

  if (!newRegister.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!newRegister.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const duplicated = registry.find(register => register.name === newRegister.name)
  if (duplicated) {
    return response.status(400).json({
      error: `a register with name ${newRegister.name} is already registered`
    })
  }


  const newId = getRndInteger(0, 1000000000)
  newRegister.id = newId.toString()

  registry = registry.concat(newRegister)
  response.json(newRegister)
})

app.get('/api/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${registry.length} people</p>
    <p>${Date().toString()}</p>
  `);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
