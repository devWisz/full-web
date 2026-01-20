const API = 'http://localhost:3000';
let urls = [];

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showError(msg) {
    const error = document.getElementById('error');
    error.textContent = msg;
    setTimeout(() => error.textContent = '', 3000);
}

async function shortenURL() {
    const input = document.getElementById('urlInput');
    const url = input.value.trim();

    if (!url) {
        showError('Please enter a URL');
        return;
    }

    if (!isValidURL(url)) {
        showError('Please enter a valid URL');
        return;
    }

    try {
        const response = await fetch(`${API}/shorten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        const shortURL = `${API}/r/${data.short}`;

        document.getElementById('shortURL').value = shortURL;
        document.getElementById('result').classList.remove('hidden');

        urls.unshift({ original: url, short: shortURL, code: data.short });
        updateHistory();
        input.value = '';

    } catch (error) {
        showError('Will take some time!');
    }
}

function copyURL() {
    const input = document.getElementById('shortURL');
    input.select();
    document.execCommand('copy');
    
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
}

function updateHistory() {
    const history = document.getElementById('history');
    const list = document.getElementById('historyList');

    if (urls.length === 0) {
        history.classList.add('hidden');
        return;
    }

    history.classList.remove('hidden');
    list.innerHTML = urls.map(item => `
        <div class="history-item">
            <p><strong>Short:</strong> ${item.short}</p>
            <p><strong>Original:</strong> ${item.original}</p>
        </div>
    `).join('');
}

document.getElementById('shortenBtn').addEventListener('click', shortenURL);
document.getElementById('copyBtn').addEventListener('click', copyURL);
document.getElementById('urlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') shortenURL();
});
