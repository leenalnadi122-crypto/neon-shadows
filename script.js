// --------- Auth State & Helpers ----------
function redirectToLogin() {
    window.location.href = "login.html";
}

function showLoginPopup() {
    const popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "flex";
}

function closePopup() {
    const popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "none";
}

// Check if user is logged in
function checkAuth() {
    if (!localStorage.getItem("isLogin")) {
        showLoginPopup();
        return false;
    }
    return true;
}

// --------- DOM Elements ----------
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const videoLink = document.getElementById("videoLink");
const progressBar = document.getElementById("progressBar");
const dropArea = document.getElementById("dropArea");
const ButtonLogin = document.getElementById("btn-login");
const ButtonLogOut = document.getElementById("btn-logout");
const browseBtn = document.getElementById("browseBtn");

// --------- Login/Logout Buttons ----------
if (ButtonLogin && ButtonLogOut) {
    if (!localStorage.getItem("isLogin")) {
        ButtonLogin.style.display = "flex";
        ButtonLogOut.style.display = "none";
    } else {
        ButtonLogin.style.display = "none";
        ButtonLogOut.style.display = "flex";
    }

    ButtonLogOut.addEventListener("click", () => {
        localStorage.removeItem("isLogin");
        alert("You have been logged out 👋");
        redirectToLogin();
    });

}

// --------- Upload Logic ----------
if (browseBtn) {
    browseBtn.addEventListener("click", () => {
        fileInput.click(); // open file picker
    });
}

if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!checkAuth()) return;

        let file = fileInput.files[0];
        let link = videoLink.value;

        if (!file && !link) {
            alert("Please upload a file or paste a link 🎥");
            return;
        }

        try {
            let videoUrl = link;

            // 🔹 If user uploaded a file, create an Object URL (not base64)
            if (file) {
                videoUrl = URL.createObjectURL(file);
            }

            // Fake keywords + timeline
            const fakeKeywords = ["Cybersecurity", "Malware", "Encryption", "Authentication", "Vulnerabilities"];
            const fakeTimeline = [{ time: "00:00", desc: "Video start" }, { time: "1:00", desc: "What is Cybersecurity" }, { time: "3:00", desc: "Video End" }];

            // 🔹 Save only metadata, not the actual file
            saveVideo({
                url: videoUrl,
                name: file ? file.name : "Video Link",
                keywords: fakeKeywords,
                timeline: fakeTimeline,
                uploadedAt: new Date().toISOString()
            });

            // Update UI
            document.getElementById("finalVideo").src = videoUrl;
            renderKeywords(fakeKeywords);
            renderTimeline(fakeTimeline);

            document.getElementById("result").scrollIntoView({ behavior: "smooth" });

            loadSavedVideos();

        } catch (err) {
            console.error(err);
            alert("Something went wrong while saving!");
        }
    });
}



// --------- Drag & Drop ----------
if (dropArea) {
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.style.background = "#f3eaff";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.background = "#faf8ff";
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        dropArea.style.background = "#faf8ff";
    });
}

// --------- Save / Load Videos ----------
function saveVideo(videoData) {
    let savedVideos = JSON.parse(localStorage.getItem("videos")) || [];
    savedVideos.push(videoData);
    localStorage.setItem("videos", JSON.stringify(savedVideos));
}

function loadSavedVideos() {
    let savedVideos = JSON.parse(localStorage.getItem("videos")) || [];
    const list = document.querySelector(".saved-videos");
    if (!list) return;

    list.innerHTML = "";
    savedVideos.forEach((video, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <a href="${video.url}" target="_blank">Video ${index + 1}</a>
            <small> (${new Date(video.uploadedAt).toLocaleString()})</small>
        `;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadSavedVideos);

// --------- Rendering Results ----------
function renderKeywords(keywords = []) {
    const list = document.querySelector(".keywords ul");
    if (!list) return;
    list.innerHTML = "";
    keywords.slice(0, 5).forEach((kw) => {
        const li = document.createElement("li");
        li.textContent = `#${kw}`;
        list.appendChild(li);
    });
}

function renderTimeline(timeline = []) {
    const list = document.querySelector(".timeline ul");
    if (!list) return;
    list.innerHTML = "";
    timeline.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.time}</span> – ${item.label}`;
        list.appendChild(li);
    });
}
document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let formData = new FormData();
    const fileInput = document.getElementById("fileInput");
    const videoLink = document.getElementById("videoLink").value;

    if (fileInput.files.length > 0) {
        formData.append("video", fileInput.files[0]);
    } else if (videoLink) {
        formData.append("video_url", videoLink);
    }

    try {
        const response = await fetch("http://localhost:5000/summarize", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Response from backend:", data);

        if (data.summary_result) {
            // مثال: خلي النتيجة تظهر
            document.querySelector("#result .keywords ul").innerHTML = "";
            document.querySelector("#result .timeline ul").innerHTML = "";

            // ببساطة رح تعرض النص كامل
            document.querySelector("#result .keywords").innerHTML = "<h2>AI Summary</h2><p>" + data.summary_result + "</p>";

            // scroll للنتيجة
            document.getElementById("result").scrollIntoView({ behavior: "smooth" });
        } else {
            alert("Error: " + JSON.stringify(data));
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong, check console.");
    }
});
