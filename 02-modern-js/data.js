/**
 * Data module for Library Management System
 * Demonstrates modern JavaScript features: Map, Set, destructuring, generators, and more
 */

// Sample book data
export const books = [
    {
        id: 1,
        title: "The Clean Coder",
        author: "Robert C. Martin",
        year: 2011,
        genre: "Programming",
        availability: { status: "available", location: "A1-23" }
    },
    {
        id: 2,
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        year: 2014,
        genre: "Programming",
        availability: { status: "checked_out", dueDate: "2024-12-01" }
    },
    {
        id: 3,
        title: "Design Patterns",
        author: "Gang of Four",
        year: 1994,
        genre: "Software Engineering"
        // availability is intentionally missing
    },
    {
        id: 4,
        title: "Clean Architecture",
        author: "Robert C. Martin",
        year: 2017,
        genre: "Programming",
        availability: { status: "available", location: "A2-15" }
    }
];

// ----------------------
// Map for book categories
export const categoryDescriptions = new Map([
    ["Programming", "Books about programming languages and techniques"],
    ["Software Engineering", "Books about software design and architecture"]
]);

// ----------------------
// Set for unique authors
export const uniqueAuthors = new Set(books.map(book => book.author));

// ----------------------
// Filter books by availability status
export function filterBooksByStatus(bookArray, status) {
    return bookArray.filter(
        book => book.availability?.status === status
    );
}

// ----------------------
// Group books by genre
export function groupBooksByGenre(bookArray) {
    return bookArray.reduce((map, book) => {
        const genre = book.genre;
        if (!map.has(genre)) {
            map.set(genre, []);
        }
        map.get(genre).push(book);
        return map;
    }, new Map());
}

// ----------------------
// Generator for book titles
export function* bookTitleGenerator(bookArray) {
    for (const { title } of bookArray) {
        yield title;
    }
}

// ----------------------
// Create formatted book summary
export function createBookSummary(book) {
    const {
        title,
        author,
        year,
        availability: { status, location, dueDate } = {}
    } = book;

    const availabilityText =
        status === "available"
            ? `Available at ${location}`
            : status === "checked_out"
            ? `Checked out, due on ${dueDate}`
            : "Availability unknown";

    return `${title} by ${author} (${year}) - ${availabilityText}`;
}
