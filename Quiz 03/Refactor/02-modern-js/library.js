/**
 * Library Management Module
 * -------------------------------------------------------
 * Demonstrates modern JavaScript class patterns and features:
 * - Private fields and encapsulation
 * - Rest/spread operators
 * - Destructuring and optional chaining
 * - Logical assignment operators
 * - Higher-order functions and memoization
 * -------------------------------------------------------
 */

import {
  books,
  categoryDescriptions,
  uniqueAuthors,
  filterBooksByStatus,
  groupBooksByGenre,
} from "./data.js";

/**
 * LibraryManager
 * -------------------------------------------------------
 * Encapsulates book operations and library analytics.
 */
export class LibraryManager {
  #statistics = {}; // private state

  constructor(initialBooks = []) {
    this.books = [...initialBooks]; // shallow copy
    this.#updateStatistics();
  }

  /**
   * Adds one or more books to the library.
   * Automatically refreshes statistics after insertion.
   *
   * @param  {...Object} newBooks - Book objects to add
   */
  addBooks(...newBooks) {
    if (!newBooks.length) return;
    this.books.push(...newBooks);
    this.#updateStatistics();
  }

  /**
   * Searches the book collection by title, author, or genre.
   * Supports case-insensitive search and partial matches.
   *
   * @param {Object} query - { title, author, genre }
   * @param {boolean} caseSensitive - Match case if true
   * @returns {Array} Filtered book list
   */
  searchBooks({ title, author, genre } = {}, caseSensitive = false) {
    const normalize = (str) =>
      caseSensitive ? str : str?.toLowerCase?.() ?? "";

    const t = normalize(title);
    const a = normalize(author);
    const g = normalize(genre);

    return this.books.filter((book) => {
      const matchTitle = t
        ? normalize(book.title).includes(t)
        : true;
      const matchAuthor = a
        ? normalize(book.author).includes(a)
        : true;
      const matchGenre = g
        ? normalize(book.genre).includes(g)
        : true;

      return matchTitle && matchAuthor && matchGenre;
    });
  }

  /**
   * Returns computed statistics for the library:
   * total, available, and checked-out counts.
   *
   * @returns {Object} statistics
   */
  getStatistics() {
    this.#updateStatistics();
    return { ...this.#statistics };
  }

  /**
   * Updates book details using logical assignment operators.
   *
   * @param {Object} book - Existing book object
   * @param {Object} updates - Fields to update
   */
  updateBook(book, updates) {
    if (!book || !updates) return;

    // Logical assignment examples:
    book.title ??= updates.title;
    book.author ||= updates.author;
    book.genre &&= updates.genre;

    // Update availability safely
    if (updates.availability) {
      book.availability = {
        ...book.availability,
        ...updates.availability,
      };
    }

    this.#updateStatistics();
  }

  /**
   * Creates a reusable formatter function for books.
   * Accepts a formatter callback to customize output.
   *
   * @param {Function} formatter - Callback(book) => formatted output
   * @returns {Function} (bookArray) => formattedResults
   */
  createBookFormatter(formatter) {
    return (bookArray) => bookArray.map(formatter);
  }

  /**
   * Memoizes expensive computations like filters or aggregations.
   * Uses a Map cache keyed by serialized arguments.
   *
   * @param {Function} fn - Function to memoize
   * @returns {Function} Memoized version
   */
  memoize(fn) {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }

  /**
   * Internal: Updates statistics whenever the dataset changes.
   * Uses private field (#statistics) for encapsulation.
   */
  #updateStatistics() {
    const available = this.books.filter(
      (b) => b.availability?.status === "available"
    ).length;
    const checkedOut = this.books.filter(
      (b) => b.availability?.status === "checked_out"
    ).length;

    this.#statistics = {
      total: this.books.length,
      available,
      checkedOut,
    };
  }
}

// -------------------------------------------------------
// Utility functions (standalone helpers)
// -------------------------------------------------------

/**
 * Returns a higher-order formatter function.
 * Example usage:
 *   const simpleFormatter = createBookFormatter(b => `${b.title} by ${b.author}`);
 */
export const createBookFormatter = (formatter) => (bookArray) =>
  Array.isArray(bookArray) ? bookArray.map(formatter) : [];

/**
 * Generic memoization utility using Map cache.
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

// -------------------------------------------------------
// Default Export: Preloaded library instance
// -------------------------------------------------------
export default new LibraryManager(books);
