/**
 * ---------------------------------------------------------------------------
 * Main Entry — Library Management System
 * ---------------------------------------------------------------------------
 * Demonstrates:
 *  - ES Modules and Import Coordination
 *  - Async Operations and Error Handling
 *  - Modern JavaScript Concepts (Scoping, Destructuring, Generators, etc.)
 * ---------------------------------------------------------------------------
 */

import {
  books,
  filterBooksByStatus,
  groupBooksByGenre,
  bookTitleGenerator,
  createBookSummary,
} from './data.js';

import libraryManager, {
  LibraryManager,
  createBookFormatter,
  memoize,
} from './library.js';

import {
  displayStatistics,
  displayBooks,
  displaySearchResults,
  showBookAnalysis,
  formatAvailability,
} from './ui.js';

/**
 * Primary application function
 * Coordinates modules, demonstrates key JS features, and logs structured output.
 */
async function runLibraryDemo() {
  console.log('%c🚀 Starting Library Management System Demo', 'color:#5b9bd5; font-weight:bold;');
  console.log('='.repeat(60));

  try {
    // Handle potential null/undefined default export fallback
    const library = libraryManager ?? new LibraryManager(books);

    demonstrateScoping();

    // 1️⃣ Display Library Overview
    console.log('\n📚 === INITIAL LIBRARY OVERVIEW ===');
    displayStatistics(library.getStatistics());
    displayBooks(library.books);

    // 2️⃣ Filtering and Grouping Demonstration
    console.log('\n🗂️ === FILTERING & GROUPING DEMO ===');
    const availableBooks = filterBooksByStatus(library.books, 'available');
    const groupedBooks = groupBooksByGenre(library.books);

    console.table(availableBooks.map(b => ({
      Title: b.title,
      Author: b.author,
      Status: formatAvailability(b.availability),
    })));

    console.log('📖 Books Grouped by Genre:');
    Object.entries(groupedBooks).forEach(([genre, group]) =>
      console.log(`  - ${genre}: ${group.length} book(s)`)
    );

    // 3️⃣ Searching Example
    console.log('\n🔎 === SEARCH DEMO ===');
    const searchResults = library.searchBooks({ author: 'Rowling' });
    displaySearchResults(searchResults);

    // 4️⃣ Generator Demonstration
    showGeneratorExample();

    // 5️⃣ Error Handling and Optional Chaining
    demonstrateErrorHandling(library);

    // 6️⃣ Advanced Functional Features
    const formatter = createBookFormatter(createBookSummary);
    console.log('\n🧩 === BOOK FORMATTER DEMO ===');
    console.log(formatter(library.books.slice(0, 2)));

    // 7️⃣ Memoization Example
    console.log('\n🧠 === MEMOIZATION DEMO ===');
    const expensiveCalculation = memoize((num) => {
      console.log('🧮 Calculating...');
      return num ** 2 + Math.random();
    });
    console.log('First call (computed):', expensiveCalculation(10));
    console.log('Second call (cached):', expensiveCalculation(10));

  } catch (error) {
    console.error('💥 Application Error:', error.message);
  } finally {
    console.log('\n✅ Demo completed successfully!');
    console.log('='.repeat(60));
  }
}

/**
 * Demonstrates variable scoping: let, const, and TDZ (Temporal Dead Zone)
 */
function demonstrateScoping() {
  console.log('\n🔍 === VARIABLE SCOPING DEMO ===');

  let message = 'Global scope variable';
  console.log('Outside block →', message);

  {
    const blockScoped = 'Inside block scope';
    let mutableScoped = 'Can be changed inside block';
    console.log('Inside block →', blockScoped, '|', mutableScoped);
    mutableScoped = 'Value updated inside block';
    console.log('Updated →', mutableScoped);
  }

  console.log('Note: Accessing blockScoped here would throw ReferenceError.');
}

/**
 * Demonstrates safe error handling and optional chaining
 */
function demonstrateErrorHandling(library) {
  console.log('\n⚠️ === ERROR HANDLING DEMO ===');

  try {
    const invalidBook = library.books?.find(b => b.title === 'Nonexistent Title');
    const title = invalidBook?.title ?? 'Unknown Book';
    console.log('Book title safely accessed →', title);

    // Simulate error scenario
    if (!invalidBook) throw new Error('Book not found in catalog.');
  } catch (error) {
    console.warn('Handled gracefully:', error.message);
  }
}

/**
 * Demonstrates use of a generator function to iterate through book titles
 */
function showGeneratorExample() {
  console.log('\n🔄 === GENERATOR DEMO ===');
  const generator = bookTitleGenerator(books);

  for (const title of generator) {
    console.log(`📘 ${title}`);
  }
}

/**
 * Demonstrates array destructuring with rest operator
 */
console.log('\n📖 === DESTRUCTURING DEMO ===');
const [firstBook, secondBook, ...remainingBooks] = books;
console.log('First Book:', firstBook.title);
console.log('Second Book:', secondBook.title);
console.log('Remaining Books Count:', remainingBooks.length);

// Launch demo
runLibraryDemo();
