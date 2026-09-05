const express = require('express')
const app = express()

app.use(express.json())

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
  const register = request.body

  const newId = getRndInteger(0, 1000000000)
  register.id = newId.toString()

  registry = registry.concat(register)
  response.json(register)
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
