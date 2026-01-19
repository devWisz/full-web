const API =  'http://localhost:3000';
let urls = [];

function isValidURL (string){
    try {
        new URL (string);
        return true;

    } catch (_){
        return false;
    }
}

function showError(msg){
    const error = document.getElementById('error');
    error.textContent = msg;
    setTimeout(()=>error.textContent='',3000);
}


async function shortenURL(){

    const input = document.getElementById ('urlInput');
    const url = input.value.trim();

    
    if (!url) {
        showError ('Empty URL. Please enter a URL.');
        return;
    }
if (!isValidURL(url)){
    showError('INVALID URL. Please enter a valid URL.');
    return;
}
}