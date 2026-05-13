import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOOKS_FILE = path.join(__dirname, "src", "lib", "books.json");
const HISTORY_FILE = path.join(__dirname, "src", "lib", "borrowingHistory.json");
const USER_FILE = path.join(__dirname, "src", "lib", "user.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increase limit for Base64 images

  // Helper to read/write books
  const getBooks = () => {
    try {
      const data = fs.readFileSync(BOOKS_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  };

  const getHistory = () => {
    try {
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  };

  const getUser = () => {
    try {
      const data = fs.readFileSync(USER_FILE, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  };

  const saveBooks = (books: any[]) => {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
  };

  const saveUser = (user: any) => {
    fs.writeFileSync(USER_FILE, JSON.stringify(user, null, 2));
  };

  // API Routes
  app.get("/api/books", (req, res) => {
    res.json(getBooks());
  });

  app.get("/api/history", (req, res) => {
    res.json(getHistory());
  });

  app.get("/api/profile", (req, res) => {
    res.json(getUser());
  });

  app.post("/api/profile", (req, res) => {
    const user = getUser();
    const updatedUser = { ...user, ...req.body };
    saveUser(updatedUser);
    res.json(updatedUser);
  });

  app.post("/api/books", (req, res) => {
    const books = getBooks();
    const newBook = { ...req.body, id: Date.now().toString() };
    books.push(newBook);
    saveBooks(books);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    let books = getBooks();
    const index = books.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...req.body };
      saveBooks(books);
      res.json(books[index]);
    } else {
      res.status(404).send("Book not found");
    }
  });

  app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    let books = getBooks();
    books = books.filter((b: any) => b.id !== id);
    saveBooks(books);
    res.status(204).send();
  });

  app.post("/api/books/:id/borrow", (req, res) => {
    const { id } = req.params;
    let books = getBooks();
    const bookIndex = books.findIndex((b: any) => b.id === id);
    
    if (bookIndex !== -1) {
      const book = books[bookIndex];
      if (book.status === "borrowed") {
        return res.status(400).json({ error: "Book is already borrowed" });
      }

      books[bookIndex].status = "borrowed";
      saveBooks(books);

      let history = getHistory();
      const newRecord = {
        id: "h" + Date.now().toString(),
        bookTitle: book.title,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "active"
      };
      history.push(newRecord);
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

      res.json({ message: "Book borrowed successfully", book: books[bookIndex] });
    } else {
      res.status(404).send("Book not found");
    }
  });

  app.post("/api/books/:id/return", (req, res) => {
    const { id } = req.params;
    let books = getBooks();
    const bookIndex = books.findIndex((b: any) => b.id === id);
    
    if (bookIndex !== -1) {
      const book = books[bookIndex];
      if (book.status !== "borrowed") {
        return res.status(400).json({ error: "Book is already available" });
      }

      books[bookIndex].status = "available";
      saveBooks(books);

      let history = getHistory();
      const historyIndex = history.findIndex((h: any) => h.bookTitle === book.title && h.status !== "returned");
      if (historyIndex !== -1) {
        history[historyIndex].returnDate = new Date().toISOString().split('T')[0];
        history[historyIndex].status = "returned";
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
      }

      res.json({ message: "Book returned successfully", book: books[bookIndex] });
    } else {
      res.status(404).send("Book not found");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
