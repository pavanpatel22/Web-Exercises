// ======== API FUNCTIONS =========

// Using Promise chaining
function getUser(id) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("User not found!");
      return res.json();
    });
}

function getPosts(userId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load posts!");
      return res.json();
    });
}

// ======== DOM ELEMENTS =========
const form = document.getElementById('userForm');
const userInfoDiv = document.getElementById('user-info');
const sessionFab = document.getElementById('session-fab');
const sessionPanel = document.getElementById('session-panel');
const closePanel = document.getElementById('close-panel');
const activityList = document.getElementById('activity-list');

const sessionLog = [];

// ======== LOGGING FUNCTION =========
function logActivity(msg) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const message = `${msg} • ${time}`;
  sessionLog.unshift(message);

  const li = document.createElement('li');
  li.textContent = message;
  li.className = 'activity-item';
  activityList.prepend(li);
}

// ======== PANEL TOGGLE =========
sessionFab.addEventListener('click', () => {
  sessionPanel.classList.toggle('show');
});

closePanel.addEventListener('click', () => {
  sessionPanel.classList.remove('show');
});

// ======== DOM RENDER FUNCTION =========
function displayUserInfo(user, posts) {
  userInfoDiv.innerHTML = `
    <div class="user-card">
      <div class="user-header">
        <h2>${user.name}</h2>
        <p><strong>📧</strong> ${user.email}</p>
        <p><strong>🏙️</strong> ${user.address.city}, ${user.address.street}</p>
        <p><strong>🌐</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
        <p><strong>🏢</strong> ${user.company.name}</p>
      </div>
      <div class="posts-section">
        <h3>📝 Recent Posts</h3>
        <ul class="posts-list">
          ${posts.map((p, i) => `<li class="post-item" data-title="${p.title}">${i + 1}. ${p.title}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  // Add event listeners to post titles
  document.querySelectorAll('.post-item').forEach((li) => {
    li.addEventListener('click', () => {
      logActivity(`You viewed post "${li.dataset.title}"`);
      li.classList.add('viewed');
      setTimeout(() => li.classList.remove('viewed'), 600);
    });
  });
}

// ======== PROMISE CHAINING IMPLEMENTATION =========
/*
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  if (!userId) return;

  logActivity(`Searching for user ID ${userId}...`);

  getUser(userId)
    .then((user) => {
      logActivity(`Found user "${user.name}"`);
      return Promise.all([user, getPosts(userId)]);
    })
    .then(([user, posts]) => {
      displayUserInfo(user, posts);
      logActivity(`Displayed user info & ${posts.length} posts`);
    })
    .catch((err) => {
      userInfoDiv.innerHTML = `<p class="error">${err.message}</p>`;
      logActivity(`Error: ${err.message}`);
    });
});
*/

// ======== ASYNC/AWAIT IMPLEMENTATION =========
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  if (!userId) return;

  logActivity(`Searching for user ID ${userId}...`);

  try {
    const user = await getUser(userId);
    const posts = await getPosts(userId);

    displayUserInfo(user, posts);
    logActivity(`Loaded user "${user.name}" successfully`);

  } catch (err) {
    userInfoDiv.innerHTML = `<p class="error">${err.message}</p>`;
    logActivity(`Error: ${err.message}`);
  }
});

// ======== SESSION START =========
logActivity("Session started 🚀");
