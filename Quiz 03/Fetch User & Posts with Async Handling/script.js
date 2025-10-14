// Fetch functions
async function getUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("No user found!");
  return res.json();
}

async function getPosts(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`);
  if (!res.ok) throw new Error("Couldn't fetch posts!");
  return res.json();
}

// Elements
const form = document.getElementById('userForm');
const userInfoDiv = document.getElementById('user-info');
const sessionFab = document.getElementById('session-fab');
const sessionPanel = document.getElementById('session-panel');
const closePanel = document.getElementById('close-panel');
const activityList = document.getElementById('activity-list');

const sessionLog = [];

// Log function (human tone)
function logActivity(msg) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const message = `${msg} • ${time}`;
  sessionLog.unshift(message);

  const li = document.createElement('li');
  li.textContent = message;
  activityList.prepend(li);
}

// Toggle session panel
sessionFab.addEventListener('click', () => {
  sessionPanel.classList.toggle('show');
});

closePanel.addEventListener('click', () => {
  sessionPanel.classList.remove('show');
});

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  if (!userId) return;

  logActivity(`You searched for user ID ${userId}`);

  try {
    const user = await getUser(userId);
    const posts = await getPosts(userId);

    userInfoDiv.innerHTML = `
      <h2>${user.name}</h2>
      <p><strong>Email:</strong> ${user.email}</p>
      <h3>📝 Posts</h3>
      <ul>${posts.map(p => `<li>${p.title}</li>`).join('')}</ul>
    `;

    logActivity(`Loaded user "${user.name}" successfully`);

    document.querySelectorAll('#user-info li').forEach(li => {
      li.addEventListener('click', () => {
        logActivity(`You viewed post "${li.textContent}"`);
      });
    });

  } catch (err) {
    userInfoDiv.innerHTML = `<p style="color:#ff4d4d;">${err.message}</p>`;
    logActivity(`Error: ${err.message}`);
  }
});

// Start session
logActivity("Session started 🚀");
