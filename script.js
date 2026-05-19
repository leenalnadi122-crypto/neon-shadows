const loader = document.createElement("div");
loader.id = "loader";
loader.innerHTML = `<div class="spinner"></div>`;
document.body.appendChild(loader);
loader.style.display = "none";

function showLoader() { loader.style.display = "flex"; }
function hideLoader() { loader.style.display = "none"; }


// const body = document.body;
// const stars = document.createElement("div");
// stars.className = "stars";
// body.appendChild(stars);

// const moon = document.createElement("div");
// moon.className = "moon";
// moon.innerHTML = `<img src="moon.png/pngwing.com.png" width="100%" alt="">`;
// body.appendChild(moon);
// const header = document.createElement("div");
// header.className = "header";

// const headerLogo = document.createElement("div");
// const siteName = document.createElement("h1");
// siteName.className = "site-name";
// siteName.id = "site-name";
// siteName.textContent = "Orbi";

// headerLogo.className = "header-logo";
// // Clear previous content
// headerLogo.innerHTML = `
//   <img src="moon.png/character.png.png" alt="Character" class="character" id="chatbot-icon">
//   <h3 id="kids-btn">Kids Zone</h3>
// `;

// // Append the h1 element properly
// headerLogo.insertBefore(siteName, headerLogo.querySelector("#kids-btn"))
// header.appendChild(headerLogo);
// // video
// const div = document.createElement("div");
// const video = document.createElement("video");
// // احط الفيديو تاعي
// video.src = "ssvid.net--JENNIE-제니-Like-Jennie-Color-Coded-Lyrics_360p";
// video.controls = true;
// video.width = 400;
// div.style.display = "none";
// div.appendChild(video);
// document.body.appendChild(div);

// siteName.addEventListener("click", () => {
//     div.style.display = div.style.display === "none" ? "block" : "none";
// });
const body = document.body;

// Stars
const stars = document.createElement("div");
stars.className = "stars";
body.appendChild(stars);

// Moon
const moon = document.createElement("div");
moon.className = "moon";
moon.innerHTML = `<img src="moon.png/pngwing.com.png" width="100%" alt="">`;
body.appendChild(moon);

// Header
const header = document.createElement("div");
header.className = "header";

// Header logo
const headerLogo = document.createElement("div");
headerLogo.className = "header-logo";

// Add character image
const characterImg = document.createElement("img");
characterImg.src = "moon.png/character.png.png";
characterImg.alt = "Character";
characterImg.className = "character";
characterImg.id = "chatbot-icon";
headerLogo.appendChild(characterImg);

// Add site name
const siteName = document.createElement("h1");
siteName.className = "site-name";
siteName.id = "site-name";
siteName.textContent = "Orbi";
headerLogo.appendChild(siteName);

// Add Kids Zone
const kidsBtn = document.createElement("h3");
kidsBtn.id = "kids-btn";
kidsBtn.textContent = "Kids Zone";
headerLogo.appendChild(kidsBtn);

// Append headerLogo to header
header.appendChild(headerLogo);
body.appendChild(header);


const headerSearch = document.createElement("div");
headerSearch.className = "header-search";
headerSearch.innerHTML = `
<form id="nasaForm">
  <div class="search">
    <span class="search-icon material-symbols-outlined">search</span>
    <input class="search-input" type="search" placeholder="Search NASA resources..." id="nasaQuery">
  </div>
</form>`;
header.appendChild(headerSearch);

body.appendChild(header);


const content = document.createElement("div");
content.className = "content";
content.innerHTML = `
<h2>Welcome to Space AI — an interactive platform where science meets imagination.</h2>
<h5>Explore the fascinating world of space biology through stories, visuals, and discoveries.
With our AI-powered guide, you can search, learn, and connect the dots of humanity’s journey beyond Earth.
</h5>`;
body.appendChild(content);

const searchResults = document.createElement("div");
searchResults.id = "searchResults";
searchResults.className = "search-results";
searchResults.style.display = "none";
searchResults.innerHTML = `
<h2>Search Results</h2>
<div class="results-container">
  <div class="cards" id="cards"></div>
  <div class="summary" id="summary">
      <h3>Summary</h3>
  </div>
</div>`;
body.appendChild(searchResults);

// -------------------- Chatbot --------------------
const chatbotContainer = document.createElement("div");
chatbotContainer.id = "chatbot-container";
// chatbotContainer.className = "hidden";
chatbotContainer.style.display = "none";
chatbotContainer.innerHTML = `
  <div id="chatbot-header">
      <span>Orbi ChatBot</span>
      <button id="close-btn">&times;</button>
  </div>
  <div id="chatbot-body">
      <div id="chatbot-messages"></div>
  </div>
  <div id="chatbot-input-container">
      <input type="text" id="chatbot-input" placeholder="Type a message...">
      <button id="send-btn">Send</button>
  </div>`;
body.appendChild(chatbotContainer);

document.addEventListener("DOMContentLoaded", function () {
    const chatbotIcon = document.getElementById("chatbot-icon");
    const closeBtn = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");


    chatbotIcon.addEventListener("click", function () {
        // chatbotContainer.classList.remove("hidden");
        chatbotContainer.style.display = "flex";
    });


    closeBtn.addEventListener("click", function () {
        // chatbotContainer.classList.add("hidden");
        chatbotContainer.style.display = "none";
    });


    sendBtn.addEventListener("click", sendMessage);
    chatbotInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            appendMessage("user", userMessage);
            chatbotInput.value = "";
            getBotResponse(userMessage);
        }
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        const apiKey = "AIzaSyDVVRArcW4eNkETxUns9ZK6SYm-eIkLAAc";
        const apiUrl = "https://api.openai.com/v1/chat/completions";

        try {
            // Call your Node backend instead of Google API directly
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            const botMessage = data.message; // Node backend returns { message: "..."}
            appendMessage("bot", botMessage);
        } catch (error) {
            console.error("Error fetching bot response:", error);
            appendMessage("bot", "⚠️ Sorry, something went wrong.");
        }
    }
});


const form = document.getElementById("nasaForm");
const input = document.getElementById("nasaQuery");
const cardsDiv = document.getElementById("cards");
const summaryDiv = document.getElementById("summary");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    input.value = "";
    input.focus();

    moon.style.display = "none";
    content.style.display = "none";
    headerLogo.style.display = "none";

    searchResults.style.display = "block";

    cardsDiv.innerHTML = "";
    summaryDiv.innerHTML = "<h3>Summary</h3>";

    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;
    try {
        showLoader();
        const response = await fetch(url);
        const data = await response.json();
        const items = data.collection.items;

        if (!items || items.length === 0) {
            cardsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        items.slice(0, 6).forEach(item => {
            const info = item.data[0];
            const img = item.links && item.links[0] ? item.links[0].href : "";

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `${img ? `<img src="${img}" alt="${info.title}">` : ""}<h4>${info.title}</h4>`;
            cardsDiv.appendChild(card);

            const summaryItem = document.createElement("div");
            summaryItem.className = "summary-item";
            summaryItem.innerHTML = `<strong>${info.title}</strong><br>${info.description ? info.description.slice(0, 120) + "..." : "No description"}`;
            summaryDiv.appendChild(summaryItem);
        });

    } catch (err) {
        console.error(err);
        cardsDiv.innerHTML = "<p>Something went wrong...</p>";
    } finally {
        hideLoader();
    }
});
document.getElementById("kids-btn").addEventListener("click", () => {
    window.open("game.html", "_blank");
});

