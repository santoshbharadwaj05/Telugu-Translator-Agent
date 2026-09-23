const englishInput = document.getElementById("english");
const teluguOutput = document.getElementById("telugu");
const statusEl = document.getElementById("status");
const translateBtn = document.getElementById("translate");
const clearBtn = document.getElementById("clear");
const copyBtn = document.getElementById("copy");

const PLACEHOLDER = "అనువాదం ఇక్కడ కనిపిస్తుంది.";

async function translate() {
  const text = englishInput.value.trim();
  if (!text) {
    statusEl.textContent = "Enter some English first.";
    statusEl.classList.remove("error");
    return;
  }

  translateBtn.disabled = true;
  copyBtn.disabled = true;
  statusEl.classList.remove("error");
  statusEl.textContent = "Translating…";

  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text);
    url.searchParams.set("langpair", "en|te");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Translation service is unavailable.");
    }

    const data = await response.json();
    const translated = data?.responseData?.translatedText?.trim();
    if (!translated) {
      throw new Error("No Telugu translation came back.");
    }

    teluguOutput.textContent = translated;
    copyBtn.disabled = false;
    statusEl.textContent = "Done.";
  } catch (error) {
    statusEl.textContent = error.message || "Translation failed.";
    statusEl.classList.add("error");
  } finally {
    translateBtn.disabled = false;
  }
}

translateBtn.addEventListener("click", translate);

englishInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    translate();
  }
});

clearBtn.addEventListener("click", () => {
  englishInput.value = "";
  teluguOutput.textContent = PLACEHOLDER;
  copyBtn.disabled = true;
  statusEl.textContent = "";
  statusEl.classList.remove("error");
  englishInput.focus();
});

copyBtn.addEventListener("click", async () => {
  const text = teluguOutput.textContent;
  if (!text || text === PLACEHOLDER) return;
  await navigator.clipboard.writeText(text);
  statusEl.classList.remove("error");
  statusEl.textContent = "Copied Telugu text.";
});
