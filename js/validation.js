const form = document.getElementById('registrationForm');
const fileInput = document.getElementById('avatar');
const dropZone = document.querySelector('.file-drop-zone');
const emailInput = document.getElementById('email');
const fileError = document.getElementById('fileError');
const emailError = document.getElementById('emailError');

const dropIcon = dropZone.querySelector('img');
const dropText = dropZone.querySelector('p');
const originalIconSrc = dropIcon.src;
const originalText = dropText.textContent;
let previewUrl = null;

const actions = document.createElement('div');
actions.className = 'preview-actions';
actions.style.display = 'none';
actions.innerHTML = `
    <button type="button" id="removeImage">Remove image</button>
    <button type="button" id="changeImage">Change image</button>
`;
dropText.after(actions);

actions.querySelector('#removeImage').addEventListener('click', (e) => {
    e.stopPropagation();
    resetPreview();
    clearFileError();
});
actions.querySelector('#changeImage').addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

dropZone.tabIndex = 0;
dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
    }
});

fileError.addEventListener('click', (e) => e.stopPropagation());

function showPreview(file) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    dropIcon.src = previewUrl;
    dropIcon.classList.add('has-preview');
    dropText.textContent = file.name;
    actions.style.display = 'flex';
}

function resetPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    fileInput.value = '';
    dropIcon.src = originalIconSrc;
    dropIcon.classList.remove('has-preview');
    dropText.textContent = originalText;
    actions.style.display = 'none';
}

function showFileError(message) {
    fileError.textContent = message;
    fileError.style.display = 'block';
    dropZone.classList.add('input-error');
}

function clearFileError() {
    fileError.style.display = 'none';
    dropZone.classList.remove('input-error');
}

function showEmailError() {
    emailError.style.display = 'block';
    emailInput.classList.add('input-error');
}

function clearEmailError() {
    emailError.style.display = 'none';
    emailInput.classList.remove('input-error');
}

function getFileProblem(file) {
    if (!file) return 'Please upload an avatar.';
    if (!['image/jpeg', 'image/png'].includes(file.type)) return 'Please upload a JPG or PNG image.';
    if (file.size > 500 * 1024) return 'File size too large. Please upload a file under 500KB.';
    return null;
}

function handleFile(file) {
    const problem = getFileProblem(file);
    if (problem) {
        resetPreview();
        showFileError(problem);
        return;
    }
    clearFileError();
    showPreview(file);
}

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(255, 255, 255, 0.12)';
});
dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = '';
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = '';
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        handleFile(fileInput.files[0]);
    }
});

emailInput.addEventListener('input', clearEmailError);

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = emailInput.value.trim();
    const github = document.getElementById('github').value.trim();

    clearFileError();
    clearEmailError();

    let hasError = false;

    const file = fileInput.files[0];
    const fileProblem = getFileProblem(file);
    if (fileProblem) {
        showFileError(fileProblem);
        hasError = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showEmailError();
        hasError = true;
    }

    if (hasError) return;

    const reader = new FileReader();
    reader.onload = () => {
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', email);
        localStorage.setItem('github', github);
        localStorage.setItem('avatar', reader.result);
        window.location.href = 'ticket.html';
    };
    reader.readAsDataURL(file);
});