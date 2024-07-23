require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const Person = require('./Models/person');
const { errorHandler } = require('./middleware');
const { request } = require('http');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

// let persons = [
//   { 
//     "id": "1",
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": "2",
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": "3",
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": "4",
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }

// ];

// Get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

// app.get('/api/persons/:id', (request, response, next) => {
//   const id = request.params.id;
//   Person.find(person => person.id === id);

//   if(person) {
//     response.json(person);
//   } else {
//     response.status(404).send({ error: 'Person not found' })
//     .catch(error => next(error));
//   }
// });

// app.get('/info', (request, response) => {
//   const numberPerson = Person.length;
//   const currentTime = new Date();

//   const requestHtml = `<p>Phonebook has info for ${numberPerson}</p>
//                        <p>${currentTime}</p>
//                        `;

//                        response.send(requestHtml)
                       
// });

// Get a person by ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if(person) {
      response.json(person);
    }else{
      response.status(404).end();
    }
  })
  .catch(error => next(error));
});

app.get('/info', (request, response) => {
  Person.find({})
  .then(persons => {
    const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}
    `;
    response.send(info);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    response.status(500).send({error: 'Error fetching data'});
  });
});

// Delete a person
app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).json({error: 'person not found'});
    }
  })
  .catch(error => next(error));
  // const id = request.params.id;
  // const personsIndex = persons.findIndex(person => person.id === id);
  
  // if(personsIndex !== -1) {
  //   Person = persons.filter(person => person.id !== id);
  //   response.status(200).end();
  // } else {
  //   response.status(404).send({ error: 'Person not found' });
  // }

    
});

// Add a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number is missing'
     });
  }

  // const nameExists = persons.some(person => person.name === body.name) 
  //   if(nameExists){
  //     return response.status(400). json({
  //       error: 'Name must be unique'
  //     });
  //   }
  

  // const id = Math.floor(Math.random() * 1000000);
  const newPerson = new Person({
    // id: id.toString(),
    name: body.name,
    number: body.number,
  });

  newPerson.save()
  .then(savedPerson => response.json(savedPerson))
  .catch(error => next(error));
  

  // persons.push(newPerson);
  // response.json(newPerson);
});

// Update a person's number
app.put('/api/person/:id', (request, response, next) => {
  const {name, number} = request.body;

  if(!name || !number) {
    return response.status(400).json({error: 'name or number missing'});
  }

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
  .then(updatedPerson => {
    if(updatedPerson) {
      response.json(updatedPerson);
    }else{
      response.status(404).json({error: 'person not found'});
    }
  })
  .catch(error => next(error));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});