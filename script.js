const inputUrl = document.querySelector(".inputUrl");
const shortenBtn = document.querySelector(".primaryBtn");
const result = document.getElementById("result");
const actionBtns = document.querySelector(".actionBtns");
const copyBtn = document.querySelector(".copyBtn");
const redirectBtn = document.querySelector(".redirectBtn");
const historyBtn = document.querySelector(".historyBtn");
const historyModal = document.querySelector(".historyModal");
const closeBtn = document.querySelector(".closeBtn");
const historyList = document.querySelector(".historyList");
const toast = document.querySelector(".toast");

let currentUrl = "";

const showToast = (message, type = "error") => {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
};

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const getHistory = () => JSON.parse(localStorage.getItem("urls")) || [];

const saveHistory = (url) => {
  const data = getHistory();
  data.unshift(url);
  localStorage.setItem("urls", JSON.stringify(data.slice(0, 20)));
};

const renderHistory = () => {
  historyList.innerHTML = "";
  getHistory().forEach(url => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${url}" target="_blank">${url}</a>
      <div>
        <button onclick="navigator.clipboard.writeText('${url}')"><i class="fa fa-copy"></i></button>
        <button onclick="window.open('${url}','_blank')"><i class="fa fa-arrow-up-right-from-square"></i></button>
      </div>
    `;
    historyList.appendChild(li);
  });
};

shortenBtn.onclick = async () => {
  const url = inputUrl.value.trim();

  if (!url) {
    showToast("URL field is empty");
    return;
  }

  if (!isValidUrl(url)) {
    showToast("Unknown or invalid URL type");
    return;
  }

  shortenBtn.textContent = "Processing...";
  shortenBtn.disabled = true;

  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const data = await res.text();

    currentUrl = data;
    result.innerHTML = `<a href="${data}" target="_blank">${data}</a>`;
    result.classList.remove("hidden");
    actionBtns.classList.remove("hidden");
    saveHistory(data);
    showToast("Shortened successfully", "success");
  } catch {
    showToast("Something went wrong");
  }

  shortenBtn.textContent = "Shorten";
  shortenBtn.disabled = false;
};

copyBtn.onclick = () => {
  navigator.clipboard.writeText(currentUrl);
  showToast("Copied to clipboard", "success");
};

redirectBtn.onclick = () => {
  window.open(currentUrl, "_blank");
};

historyBtn.onclick = () => {
  renderHistory();
  historyModal.classList.remove("hidden");
};

closeBtn.onclick = () => {
  historyModal.classList.add("hidden");
}