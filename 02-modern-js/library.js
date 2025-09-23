/**
 * Library management module demonstrating modern JavaScript features
 */

import { books, categoryDescriptions, uniqueAuthors, filterBooksByStatus, groupBooksByGenre, createBookSummary } from './data.js';

/**
 * LibraryManager class demonstrating modern JavaScript class features
 */
export class LibraryManager {
    #statistics = {}; // Private field for storing statistics

    constructor(initialBooks = []) {
        this.books = [...initialBooks]; // Shallow copy using spread
        this.#updateStatistics();
    }

    // ----------------------
    // Add multiple books using rest parameter
    addBooks(...newBooks) {
        this.books.push(...newBooks);
        this.#updateStatistics();
    }

    // ----------------------
    // Search books by title, author, or genre
    searchBooks({ title, author, genre } = {}, caseSensitive = false) {
        return this.books.filter(book => {
            const match = (field, value) => {
                if (!value || !field) return true;
                return caseSensitive
                    ? field.includes(value)
                    : field.toLowerCase().includes(value.toLowerCase());
            };

            return (
                match(book.title, title) &&
                match(book.author, author) &&
                match(book.genre, genre)
            );
        });
    }

    // ----------------------
    // Return computed statistics
    getStatistics() {
        return { ...this.#statistics };
    }

    // ----------------------
    // Update a book object using logical assignment operators
    updateBook(book, updates) {
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                book[key] ??= value; // Assign if undefined
            }
        });

        if (updates.availability) {
            book.availability ||= {};
            Object.entries(updates.availability).forEach(([k, v]) => {
                book.availability[k] ??= v;
            });
        }

        this.#updateStatistics();
        return book;
    }

    // ----------------------
    // Private method to calculate statistics
    #updateStatistics() {
        const total = this.books.length;
        const available = this.books.filter(b => b.availability?.status === 'available').length;
        const checkedOut = this.books.filter(b => b.availability?.status === 'checked_out').length;

        this.#statistics = { total, available, checkedOut };
    }
}

// ----------------------
// Higher-order function to format books
export const createBookFormatter = (formatter) => {
    return (bookArray) => bookArray.map(book => formatter(book));
};

// ----------------------
// Memoization function using Map
export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (!cache.has(key)) {
            const result = fn(...args);
            cache.set(key, result);
        }
        return cache.get(key);
    };
};

// ----------------------
// Default library instance
export default new LibraryManager(books);
