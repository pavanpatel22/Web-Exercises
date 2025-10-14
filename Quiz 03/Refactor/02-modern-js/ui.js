/**
 * ---------------------------------------------------------------------------
 * UI Utilities Module — Library Management System
 * ---------------------------------------------------------------------------
 * Purpose:
 *   - Handles user-facing display logic for the console.
 *   - Demonstrates modern JavaScript syntax:
 *       → Destructuring
 *       → Template literals
 *       → Optional chaining
 *       → Array methods (map, filter, reduce)
 * ---------------------------------------------------------------------------
 */

/**
 * Displays overall library statistics with clean formatting.
 * @param {Object} statistics - The statistics object (total, available, checkedOut)
 */
export function displayStatistics(statistics) {
  if (!statistics) {
    console.warn('⚠️ No statistics available.');
    return;
  }

  const { total = 0, available = 0, checkedOut = 0 } = statistics;

  console.log('\n📊 === LIBRARY STATISTICS ===');
  console.log(`
    Total Books     : ${total}
    Available Books : ${available}
    Checked Out     : ${checkedOut}
  `);

  const availabilityRate = total ? ((available / total) * 100).toFixed(1) : 0;
  console.log(`📈 Availability Rate: ${availabilityRate}%`);
}

/**
 * Displays a formatted list of books in table-like layout.
 * @param {Array} books - Array of book objects
 * @param {string} title - Optional title for the section
 */
export function displayBooks(books, title = 'Library Books') {
  if (!Array.isArray(books) || books.length === 0) {
    console.log(`\n📚 ${title}: No books to display.`);
    return;
  }

  console.log(`\n📖 === ${title.toUpperCase()} (${books.length}) ===`);

  books.forEach(({ title, author, genre, availability }, index) => {
    const status = formatAvailability(availability);
    console.log(
      `${index + 1}. ${title} — ${author} [${genre}] → ${status}`
    );
  });
}

/**
 * Displays search results dynamically with formatted context.
 * @param {Array} searchResults - Filtered list of books
 * @param {Object} searchCriteria - Search parameters (title, author, genre)
 */
export function displaySearchResults(searchResults, searchCriteria = {}) {
  const { title, author, genre } = searchCriteria;
  const criteriaText = [
    title && `Title: "${title}"`,
    author && `Author: "${author}"`,
    genre && `Genre: "${genre}"`,
  ]
    .filter(Boolean)
    .join(' | ');

  console.log(
    `\n🔎 === SEARCH RESULTS${criteriaText ? ` (${criteriaText})` : ''} ===`
  );

  if (!searchResults?.length) {
    console.log('No matching books found.');
    return;
  }

  displayBooks(searchResults, 'Search Matches');
}

/**
 * Formats availability status with modern syntax and emojis.
 * @param {Object} availability - Availability object
 * @returns {string} A human-readable status string
 */
export function formatAvailability(availability) {
  const status = availability?.status ?? 'unknown';
  const dueDate = availability?.dueDate ?? null;

  switch (status) {
    case 'available':
      return '✅ Available';
    case 'checked_out':
      return `❌ Checked Out${dueDate ? ` (Due: ${dueDate})` : ''}`;
    default:
      return '⚪ Unknown Status';
  }
}

/**
 * Displays a quick analytical summary of the library collection.
 * Uses array methods like map, filter, and reduce.
 * @param {Array} books - Collection of books
 */
export function showBookAnalysis(books) {
  if (!Array.isArray(books) || books.length === 0) {
    console.warn('⚠️ No books available for analysis.');
    return;
  }

  console.log('\n📈 === BOOK ANALYSIS REPORT ===');

  // 1️⃣ Genre Distribution
  const genreDistribution = books.reduce((acc, { genre }) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📚 Genre Distribution:');
  Object.entries(genreDistribution).forEach(([genre, count]) =>
    console.log(`   • ${genre.padEnd(15)} → ${count}`)
  );

  // 2️⃣ Publication Decade Analysis
  const decadeCounts = books.reduce((acc, { year }) => {
    const decade = Math.floor(year / 10) * 10;
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const mostPopularDecade = Object.entries(decadeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  console.log('\n🕰️ Books by Decade:');
  Object.entries(decadeCounts).forEach(([decade, count]) =>
    console.log(`   • ${decade}s → ${count}`)
  );

  console.log(`\n🏆 Most Published Decade: ${mostPopularDecade || 'N/A'}`);

  // 3️⃣ Top Authors (bonus insight)
  const topAuthors = books
    .map(b => b.author)
    .reduce((acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

  const sortedAuthors = Object.entries(topAuthors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  console.log('\n🧑‍💻 Top 3 Authors:');
  sortedAuthors.forEach(([author, count]) =>
    console.log(`   • ${author}: ${count} book(s)`)
  );

  console.log('\n✅ Analysis complete.\n');
}
