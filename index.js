const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 8080;

server.use(cors());

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use("/api", router);

server.get("/api/books", (req, res) => {
  const books = router.db.get("Book").value();
  res.json(books);
});

server.post("/api/books", (req, res) => {
  const books = router.db.get("Book");
  const newBook = {
    id: books.value().length + 1,
    ...req.body
  };
  books.push(newBook).write();
  res.json(newBook);
});

server.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const books = router.db.get("Book");
  const book = books.find({ id: parseInt(id) }).value();
  
  if (!book) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  books.find({ id: parseInt(id) })
    .assign(req.body)
    .write();
  
  res.json(books.find({ id: parseInt(id) }).value());
});

server.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const books = router.db.get("Book");
  const book = books.find({ id: parseInt(id) }).value();
  
  if (!book) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }

  books.remove({ id: parseInt(id) }).write();
  res.json({ message: "Libro eliminado correctamente" });
});

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});