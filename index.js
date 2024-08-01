const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const path = require('path'); // Add this line

let notes = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "num": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "num": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "num": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Dean Winchester", 
    "num": "39-23-6423122"
  }
];

app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist'))); // Add this line

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === id);
  
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.post('/api/notes', (request, response) => {
  console.log('Received POST request at /api/notes');
  const body = request.body;
  console.log('Request body:', body);

  if (!body.name || !body.num) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    });
  }

  const nameExists = notes.some(note => note.name === body.name);

  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const newNote = {
    id: uuidv4(),
    name: body.name,
    num: body.num
  };

  notes = notes.concat(newNote);
  response.json(newNote);
});

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter(note => note.id !== id);
  response.status(204).end();
});

app.get('/info', (request, response) => {
  const numberOfPeople = notes.length;
  const requestTime = new Date();
  response.send(
    `<p>Phonebook has info for ${numberOfPeople} people</p>
    <p>${requestTime}</p>`
  );
});

// Catch-all handler for all other routes to serve the React app
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html')); // Add this line
});

//const PORT = 3001;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});