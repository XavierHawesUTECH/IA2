document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    const github = localStorage.getItem('github');

    if (!name || !email || !github) return window.location.href = 'login.html';

    document.getElementById('displayName').textContent = name;
    document.getElementById('displayFullName').textContent = name;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('displayGithub').textContent = github;
    document.getElementById('displayAvatar').src = localStorage.getItem('avatar');
});