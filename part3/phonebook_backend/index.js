const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('req-body', (req) => JSON.stringify(req.body));

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const date = new Date();
  const personCount = persons.length;
  response.send(`<p>Phonebook has info for ${personCount} people<br>${date}</p>`)
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const generateId = () => Math.floor(Math.random() * 1000);

  const body = request.body

  if(!body || !body.number || !body.name){
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  if(persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    "id": generateId(),
    "name": body.name,
    "number": body.number,
  }

  persons = persons.concat(person)
  response.status(201).json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(entry => entry.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})