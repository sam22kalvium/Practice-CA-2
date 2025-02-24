const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Add a new book
router.post('/', async (req, res) => {
    const { title, author, price, stock } = req.body;
    if (!title) return res.status(400).json({ error: "Invalid title. Title cannot be empty." });
    if (!/^[A-Za-z\s]+$/.test(author)) return res.status(400).json({ error: "Invalid author name. Only letters and spaces are allowed." });
    if (price < 0) return res.status(400).json({ error: "Price must be a positive number." });
    if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ error: "Stock must be a non-negative integer." });
    try {
        const newBook = new Book({ title, author, price, stock });
        await newBook.save();
        res.status(201).json({ message: "Book added successfully", data: newBook });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Retrieve all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        if (books.length === 0) return res.json({ message: "No books available." });
        res.json({ message: "Books retrieved successfully", data: books });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update book stock
router.put('/', async (req, res) => {
    const { title, stock } = req.body;
    if (!title) return res.status(400).json({ error: "Book title cannot be empty." });
    if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ error: "Stock must be a non-negative integer." });
    try {
        const book = await Book.findOneAndUpdate({ title }, { stock }, { new: true });
        if (!book) return res.json({ message: "Book not found." });
        res.json({ message: "Stock updated successfully", data: book });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a book
router.delete('/', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Book title cannot be empty." });
    try {
        const book = await Book.findOneAndDelete({ title });
        if (!book) return res.json({ message: "Book not found." });
        res.json({ message: "Book deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
