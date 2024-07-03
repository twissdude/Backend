const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

let persons = [
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

];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const numberPerson = persons.length;
  const currentTime = new Date();

  const requestHtml = `<p>Phonebook has info for ${numberPerson}</p>
                       <p>${currentTime}</p>
                       `;

                       response.send(requestHtml);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id);

  if(person) {
    response.json(person);
  } else {
    response.status(404).send({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const personsIndex = persons.findIndex(person => person.id === id);
  
  if(personsIndex !== -1) {
    persons = persons.filter(person => person.id !== id);
    response.status(200).end();
  } else {
    response.status(404).send({ error: 'Person not found' });
  }

    
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number is missing'
     });
  }

  const nameExists = persons.some(person => person.name === body.name) 
    if(nameExists){
      return response.status(400). json({
        error: 'Name must be unique'
      });
    }
  

  const id = Math.floor(Math.random() * 1000000);
  const newPerson = {
    id: id.toString(),
    name: body.name,
    number: body.number
  };

  persons.push(newPerson);
  response.json(newPerson);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});