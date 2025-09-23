/**
 * Main entry point for the Library Management System
 * Demonstrates ES6 modules, async operations, and coordination of different modules
 */

import { books, filterBooksByStatus, groupBooksByGenre, bookTitleGenerator, createBookSummary } from './data.js';
import libraryManager, { LibraryManager, createBookFormatter, memoize } from './library.js';
import { displayStatistics, displayBooks, displaySearchResults, showBookAnalysis, formatAvailability } from './ui.js';

/**
 * ----------------------
 * Run the main library demo
 * ----------------------
 */
async function runLibraryDemo() {
    console.log('🚀 Starting Library Management System Demo');
    console.log('='.repeat(60));

    try {
        // Handle case where default export might be null
        const library = libraryManager || new LibraryManager(books);

        demonstrateScoping();
        demonstrateDestructuring();

        console.log('\n📊 Library Statistics:');
        displayStatistics(library.getStatistics());

        console.log('\n🔎 Filtered Books (Available):');
        const availableBooks = filterBooksByStatus(library.books, 'available');
        displayBooks(availableBooks);

        console.log('\n📚 Books Grouped by Genre:');
        const grouped = groupBooksByGenre(library.books);
        showBookAnalysis(grouped);

        console.log('\n🔄 Generator Example (Book Titles):');
        showGeneratorExample();

        console.log('\n⚙️  Error Handling Demo:');
        demonstrateErrorHandling(library);

        console.log('\n🎨 Book Formatting Example:');
        const formatter = createBookFormatter(createBookSummary);
        displayBooks(formatter(library.books));

    } catch (error) {
        console.error('Application error:', error?.message ?? error);
    } finally {
        console.log('\n✅ Demo completed!');
        console.log('='.repeat(60));
    }
}

/**
 * ----------------------
 * Demonstrate variable scoping (let/const, block scoping, temporal dead zone)
 * ----------------------
 */
function demonstrateScoping() {
    console.log('\n🔍 === VARIABLE SCOPING DEMO ===');

    const globalConst = 'I am constant';
    let globalLet = 'I can change';

    {
        let blockLet = 'Block scoped let';
        const blockConst = 'Block scoped const';
        console.log('Inside block:', blockLet, blockConst);
        // globalConst = 'try change'; // ❌ Would throw error
        globalLet = 'Updated global let inside block';
    }

    console.log('Outside block:', globalConst, globalLet);
}

/**
 * ----------------------
 * Demonstrate destructuring with rest pattern
 * ----------------------
 */
function demonstrateDestructuring() {
    console.log('\n📖 === DESTRUCTURING DEMO ===');
    const [firstBook, secondBook, ...remainingBooks] = books;
    console.log('First Book:', firstBook.title);
    console.log('Second Book:', secondBook.title);
    console.log('Remaining Books Count:', remainingBooks.length);
}

/**
 * ----------------------
 * Demonstrate safe error handling with optional chaining and nullish coalescing
 * ----------------------
 */
function demonstrateErrorHandling(library) {
    console.log('\n⚠️  === ERROR HANDLING DEMO ===');

    // Access a property safely using optional chaining
    const bookWithAvailability = library.books[2]?.availability?.status ?? 'Unknown status';
    console.log('Third book availability status:', bookWithAvailability);

    // Try-catch example
    try {
        const undefinedFunction = null;
        undefinedFunction(); // Will throw
    } catch (err) {
        console.error('Caught error:', err.message);
    }
}

/**
 * ----------------------
 * Demonstrate generator iteration
 * ----------------------
 */
function showGeneratorExample() {
    console.log('\n🔄 === GENERATOR DEMO ===');
    const generator = bookTitleGenerator(books);
    for (const title of generator) {
        console.log('Book Title:', title);
    }
}

// ----------------------
// Start the application
// ----------------------
runLibraryDemo();
