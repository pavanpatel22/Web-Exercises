/**
 * ---------------------------------------------------------------------------
 * Library Manager Module — Library Management System
 * ---------------------------------------------------------------------------
 * Features:
 *   - Class-based design with private fields and modern JS practices
 *   - Methods for adding, searching, updating, and analyzing books
 *   - Demonstrates higher-order functions and memoization
 * ---------------------------------------------------------------------------
 */

import { books } from './data.js';

export class LibraryManager {
  // Private field to hold computed statistics
  #statistics = {};

  /**
   * Initializes the library manager with an initial set of books
   * @param {Array} initialBooks
   */
  constructor(initialBooks = []) {
    this.books = [...initialBooks]; // shallow copy
    this.#updateStatistics();
  }

  // -------------------------------------------------------------------------
  // 📖 Book Management
  // -------------------------------------------------------------------------

  /**
   * Adds multiple books at once
   * @param  {...Object} newBooks
   */
  addBooks(...newBooks) {
    if (!newBooks.length) return;
    this.books.push(...newBooks);
    console.log(`🟢 Added ${newBooks.length} book(s) to the library.`);
    this.#updateStatistics();
  }

  /**
   * Searches books by optional criteria
   * @param {Object} param0 - {title, author, genre}
   * @param {boolean} caseSensitive - Whether search should be case-sensitive
   * @returns {Array} Matching books
   */
  searchBooks({ title, author, genre } = {}, caseSensitive = false) {
    return this.books.filter((book) => {
      const matches = [];
      if (title) {
        matches.push(
          caseSensitive
            ? book.title === title
            : book.title.toLowerCase().includes(title.toLowerCase())
        );
      }
      if (author) {
        matches.push(
          caseSensitive
            ? book.author === author
            : book.author.toLowerCase().includes(author.toLowerCase())
        );
      }
      if (genre) {
        matches.push(
          caseSensitive
            ? book.genre === genre
            : book.genre.toLowerCase() === genre.toLowerCase()
        );
      }
      return matches.every(Boolean); // all criteria must match
    });
  }

  // -------------------------------------------------------------------------
  // 📊 Statistics
  // -------------------------------------------------------------------------

  /**
   * Returns current statistics for the library
   * @returns {Object} {total, available, checkedOut}
   */
  getStatistics() {
    return { ...this.#statistics };
  }

  /**
   * Updates book properties safely using logical assignment operators
   * @param {Object} book - Book object reference
   * @param {Object} updates - Partial updates (title, author, availability, etc.)
   */
  updateBook(book, updates) {
    if (!book || !updates) return;
    book.title ||= updates.title;
    book.author ||= updates.author;
    book.genre ||= updates.genre;
    book.year ??= updates.year;

    // Merge availability carefully
    if (updates.availability) {
      book.availability ||= {};
      book.availability.status ||= updates.availability.status;
      book.availability.location ||= updates.availability.location;
      book.availability.dueDate ||= updates.availability.dueDate;
    }

    this.#updateStatistics();
    console.log(`✏️ Updated book: ${book.title}`);
  }

  // -------------------------------------------------------------------------
  // 🧮 Internal Helpers
  // -------------------------------------------------------------------------

  /**
   * Recalculates statistics and stores in private field
   */
  #updateStatistics() {
    const total = this.books.length;
    const available = this.books.filter(
      (b) => b.availability?.status === 'available'
    ).length;
    const checkedOut = this.books.filter(
      (b) => b.availability?.status === 'checked_out'
    ).length;

    this.#statistics = { total, available, checkedOut };
  }
}

// -------------------------------------------------------------------------
// 🧩 Higher-Order Utilities
// -------------------------------------------------------------------------

/**
 * Returns a function that applies a formatter to an array of books
 * @param {Function} formatter - Function that formats a single book
 */
export const createBookFormatter = (formatter) => (bookArray) =>
  bookArray.map(formatter);

/**
 * Memoization utility to cache expensive function results
 * @param {Function} fn
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// -------------------------------------------------------------------------
// 🚀 Default Library Instance
// -------------------------------------------------------------------------

export default new LibraryManager(books);

