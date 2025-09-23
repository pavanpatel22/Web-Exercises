/**
 * UI utilities module demonstrating modern JavaScript features
 */

/**
 * Display library statistics
 * @param {Object} statistics - Object containing total, available, checkedOut
 */
export function displayStatistics(statistics) {
    const { total = 0, available = 0, checkedOut = 0 } = statistics;
    console.log(`
📊 Library Statistics:
----------------------
Total Books       : ${total}
Available Books   : ${available}
Checked Out Books : ${checkedOut}
    `);
}

/**
 * Display a list of books with optional title
 * @param {Array} books - Array of book objects
 * @param {string} title - Section title
 */
export function displayBooks(books, title = "Books") {
    console.log(`\n📚 === ${title} ===`);
    books.forEach((book, idx) => {
        const availabilityText = formatAvailability(book.availability);
        console.log(`${idx + 1}. ${book.title} by ${book.author} (${book.year}) - ${availabilityText}`);
    });
}

/**
 * Display search results with dynamic title based on criteria
 * @param {Array} searchResults - Array of book objects
 * @param {Object} searchCriteria - Object with title, author, genre
 */
export function displaySearchResults(searchResults, searchCriteria = {}) {
    const { title, author, genre } = searchCriteria;
    const criteria = [
        title ? `Title: "${title}"` : null,
        author ? `Author: "${author}"` : null,
        genre ? `Genre: "${genre}"` : null
    ].filter(Boolean).join(', ') || 'All Books';

    console.log(`\n🔎 Search Results (${criteria}):`);
    if (!searchResults.length) {
        console.log('No matching books found.');
    } else {
        displayBooks(searchResults, `Matching Books (${searchResults.length})`);
    }
}

/**
 * Format availability status for display
 * @param {Object} availability - Book availability object
 * @returns {string} Formatted availability string
 */
export function formatAvailability(availability) {
    if (!availability) return 'Availability unknown ❓';

    const { status, location, dueDate } = availability;
    return status === 'available'
        ? `Available ✅ at ${location ?? 'Unknown location'}`
        : status === 'checked_out'
        ? `Checked Out ⏳, due on ${dueDate ?? 'Unknown date'}`
        : 'Status unknown ❓';
}

/**
 * Analyze book collection and display insights
 * @param {Array} books - Array of book objects
 */
export function showBookAnalysis(books) {
    console.log('\n🔍 === BOOK ANALYSIS ===');

    if (!books.length) {
        console.log('No books available for analysis.');
        return;
    }

    // Analyze decades
    const decades = books.map(({ year }) => Math.floor(year / 10) * 10);
    const decadeCounts = decades.reduce((acc, dec) => {
        acc[dec] = (acc[dec] || 0) + 1;
        return acc;
    }, {});
    console.log('📅 Publication Decades:', decadeCounts);

    // Analyze genre distribution
    const genreCounts = books.reduce((acc, { genre }) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
    }, {});
    console.log('🗂️  Genre Distribution:', genreCounts);

    // Most prolific author
    const authorCounts = books.reduce((acc, { author }) => {
        acc[author] = (acc[author] || 0) + 1;
        return acc;
    }, {});
    const mostProlific = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];
    console.log('✍️  Most Prolific Author:', mostProlific?.[0], `(${mostProlific?.[1]} books)`);
}
