/**
 * ---------------------------------------------------------------------------
 * Data Module — Library Management System
 * ---------------------------------------------------------------------------
 * Purpose:
 *   - Serves as the centralized data layer for the Library System.
 *   - Demonstrates modern JavaScript capabilities:
 *       → Maps and Sets
 *       → Destructuring and optional chaining
 *       → Generators
 *       → Template literals
 * ---------------------------------------------------------------------------
 * Author: Pavan Patel
 * Date: October 2025
 */

// ---------------------------------------------------------------------------
// 📚 Sample Book Data (Clean, realistic dataset)
// ---------------------------------------------------------------------------
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
    author: "Erich Gamma et al.",
    year: 1994,
    genre: "Software Engineering",
    // Note: Availability intentionally omitted to simulate missing data
  },
  {
    id: 4,
    title: "Clean Architecture",
    author: "Robert C. Martin",
    year: 2017,
    genre: "Programming",
    availability: { status: "available", location: "A2-15" },
  },
  {
    id: 5,
    title: "Refactoring",
    author: "Martin Fowler",
    year: 2018,
    genre: "Software Engineering",
    availability: { status: "available", location: "B3-02" },
  },
];

// ---------------------------------------------------------------------------
// 🗂️ Category Descriptions (Map)
// ---------------------------------------------------------------------------
// Maps genre names to human-readable descriptions.
export const categoryDescriptions = new Map([
  [
    "Programming",
    "Books focusing on coding practices, software craftsmanship, and language fluency.",
  ],
  [
    "Software Engineering",
    "Works exploring design patterns, architecture principles, and system scalability.",
  ],
]);

// ---------------------------------------------------------------------------
// ✍️ Unique Author Set (Set)
// ---------------------------------------------------------------------------
// Extracts all distinct author names using the spread operator.
export const uniqueAuthors = new Set([...books.map(({ author }) => author)]);

// ---------------------------------------------------------------------------
// 🔍 Utility Functions
// ---------------------------------------------------------------------------

/**
 * Filters books by their availability status.
 * @param {Array} bookArray - Array of book objects
 * @param {string} status - Desired status ('available' or 'checked_out')
 * @returns {Array} Filtered list of books
 */
export function filterBooksByStatus(bookArray, status) {
  return bookArray.filter(
    (book) => book.availability?.status?.toLowerCase() === status.toLowerCase()
  );
}

/**
 * Groups books by genre using Map (preserves insertion order).
 * @param {Array} bookArray - Array of book objects
 * @returns {Map<string, Array>} Genre → Array of books
 */
export function groupBooksByGenre(bookArray) {
  const grouped = new Map();
  for (const book of bookArray) {
    const { genre } = book;
    if (!grouped.has(genre)) grouped.set(genre, []);
    grouped.get(genre).push(book);
  }
  return grouped;
}

// ---------------------------------------------------------------------------
// 🧠 Advanced JavaScript Demonstrations
// ---------------------------------------------------------------------------

/**
 * Generator function that yields book titles lazily.
 * @param {Array} bookArray - Array of book objects
 */
export function* bookTitleGenerator(bookArray) {
  for (const { title } of bookArray) {
    yield title;
  }
}

/**
 * Creates a clean, readable summary string for a book.
 * @param {Object} book - Book object
 * @returns {string} Formatted summary
 * Example:
 *   "The Clean Coder by Robert C. Martin (2011) — Available at A1-23"
 */
export function createBookSummary(book) {
  const {
    title,
    author,
    year,
    availability: { status, location, dueDate } = {},
  } = book;

  const availabilityText =
    status === "available"
      ? `Available at ${location ?? "Unknown Location"}`
      : status === "checked_out"
      ? `Checked out, due on ${dueDate ?? "N/A"}`
      : "Status Unknown";

  return `${title} by ${author} (${year}) — ${availabilityText}`;
}

// ---------------------------------------------------------------------------
// 🧩 Demonstration: Logging Metadata (for fun)
// ---------------------------------------------------------------------------

console.log("📚 Loaded Book Data:", books.length, "records");
console.log("🗂️ Categories:", [...categoryDescriptions.keys()].join(", "));
console.log("👨‍💻 Unique Authors:", [...uniqueAuthors].join(", "));
