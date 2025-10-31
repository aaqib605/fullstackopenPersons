import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  const nameExists = persons.some((p) => p.name === name);
  if (nameExists) {
    return res.status(400).json({ message: `Name ${name} already exists` });
  }

  if (!name || !number) {
    return res.status(400).json({ message: "Name or number is missing" });
  } else {
    const newPerson = {
      id: Math.ceil(Math.random() * 10000).toString(),
      name,
      number,
    };

    persons.push(newPerson);
    return res.status(201).json(persons);
  }
});

app.get("/info", (req, res) => {
  const numPersons = persons.length;
  const currentDate = new Date();

  res.send(
    `
    <p>Phonebook has info for ${numPersons} people</p>
    <p>${currentDate}</p>
    `
  );
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  const exists = persons.some((p) => p.id === id);
  if (!exists) {
    return res.status(404).json({ message: "Person not found" });
  }

  persons = persons.filter((p) => p.id !== id);

  return res.status(204).end();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
