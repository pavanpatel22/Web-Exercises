/**
 * Library Management System – Data Module
 * ----------------------------------------------------
 * Demonstrates clean data modeling and modern ES6+ JavaScript techniques:
 * - Arrays, Maps, Sets
 * - Filtering and grouping
 * - Destructuring, optional chaining
 * - Generator functions
 * ----------------------------------------------------
 * Author: Pavan Patel
 * Version: 1.0
 */

// ---------------------------------------------
// Sample Data: Book Collection
// ---------------------------------------------
export const books = [
  {
    id: 1,
    title: "The Clean Coder",
    author: "Robert C. Martin",
    year: 2011,
    genre: "Programming",
    availability: { status: "available", location: "A1-23" },
  },
  {
    id: 2,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    year: 2014,
    genre: "Programming",
    availability: { status: "checked_out", dueDate: "2024-12-01" },
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Gang of Four",
    year: 1994,
    genre: "Software Engineering",
    // Note: Availability intentionally omitted to test optional chaining
  },
  {
    id: 4,
    title: "Clean Architecture",
    author: "Robert C. Martin",
    year: 2017,
    genre: "Programming",
    availability: { status: "available", location: "A2-15" },
  },
];

// ---------------------------------------------
// Book Categories (Map) & Unique Authors (Set)
// ---------------------------------------------

/**
 * Map: Category Descriptions
 * Represents different genres and their meaning in a readable format.
 */
export const categoryDescriptions = new Map([
  ["Programming", "Books about programming languages, paradigms, and techniques."],
  ["Software Engineering", "Books focused on software design, patterns, and architecture."],
]);

/**
 * Set: Unique Authors
 * Extracted using Array.map() + spread syntax for a clean, immutable result.
 */
export const uniqueAuthors = new Set([...books.map((book) => book.author)]);

// ---------------------------------------------
// Utility Functions
// ---------------------------------------------

/**
 * Filters books by their availability status (e.g., "available", "checked_out").
 * Safely handles cases where availability data may be missing.
 *
 * @param {Array} bookArray - Array of book objects
 * @param {string} status - Desired status to filter by
 * @returns {Array} Filtered array of books matching the given status
 */
export function filterBooksByStatus(bookArray, status) {
  if (!Array.isArray(bookArray)) return [];

  return bookArray.filter(
    (book) => book.availability?.status?.toLowerCase() === status.toLowerCase()
  );
}

/**
 * Groups books by genre and stores them in a Map.
 *
 * @param {Array} bookArray - Array of book objects
 * @returns {Map} Map where keys are genres and values are arrays of books
 */
export function groupBooksByGenre(bookArray) {
  const grouped = new Map();

  for (const book of bookArray) {
    const { genre } = book;
    if (!grouped.has(genre)) {
      grouped.set(genre, []);
    }
    grouped.get(genre).push(book);
  }

  return grouped;
}

// ---------------------------------------------
// Generator and Summary Helpers
// ---------------------------------------------

/**
 * Generator that yields each book title in the collection.
 * Can be iterated using for...of or spread syntax.
 *
 * @param {Array} bookArray - Array of book objects
 */
export function* bookTitleGenerator(bookArray) {
  for (const { title } of bookArray) {
    yield title;
  }
}

/**
 * Creates a formatted summary for a given book.
 * Demonstrates destructuring, optional chaining, and template literals.
 *
 * @param {Object} book - A single book object
 * @returns {string} Formatted summary string
 *
 * Example:
 * "The Clean Coder by Robert C. Martin (2011) - Available at A1-23"
 */
export function createBookSummary(book) {
  if (!book) return "Invalid book data.";

  const {
    title,
    author,
    year,
    availability: { status = "unknown", location, dueDate } = {},
  } = book;

  const statusText =
    status === "available"
      ? `Available at ${location}`
      : status === "checked_out"
      ? `Checked out (due ${dueDate})`
      : "Status unknown";

  return `${title} by ${author} (${year}) - ${statusText}`;
}

// ---------------------------------------------
// Example Usage (Optional Demo)
// ---------------------------------------------
// Uncomment below lines to test functionality in Node or browser console:

// console.log("Unique Authors:", uniqueAuthors);
// console.log("Available Books:", filterBooksByStatus(books, "available"));
// console.log("Grouped Books:", groupBooksByGenre(books));
// console.log("Summaries:");
// for (const book of books) console.log(createBookSummary(book));
// console.log("Book Titles:", [...bookTitleGenerator(books)]);
