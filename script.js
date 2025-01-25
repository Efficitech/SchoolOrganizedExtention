document.addEventListener("DOMContentLoaded", () => {
    loadBookmarks();
    loadBackground();
});

let currentPreset = "preset1";

// Open the Add Bookmark modal
const addButton = document.querySelector(".add");
const addModal = document.getElementById("addModal");
const modalAddBtn = document.getElementById("modalAddBtn");
const bookmarkValueInput = document.getElementById("bookmarkValue");

// Open the Change Background modal
const changeBgButton = document.querySelector(".change-body-bg");
const bgModal = document.getElementById("bgModal");
const bgColorPicker = document.getElementById("bgColorPicker");
const bgChangeBtn = document.getElementById("bgChangeBtn");
const bgImageInput = document.getElementById("bgImagePicker");

const bookmarkNameInput = document.getElementById("bookmarkName");

// Modal close buttons
const closeModalButtons = document.querySelectorAll(".close");

// Open the modal for adding a bookmark
addButton.addEventListener("click", () => {
    addModal.style.display = "block";
});

// Open the modal for changing background color
changeBgButton.addEventListener("click", () => {
    bgModal.style.display = "block";
});

// Close modals
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        addModal.style.display = "none";
        bgModal.style.display = "none";
    });
});

// Save and close the modal for adding a bookmark
modalAddBtn.addEventListener("click", () => {
    const bookmarkValue = bookmarkValueInput.value;
    if (bookmarkValue) {
        addBookmark(bookmarkValue);
        addModal.style.display = "none";
    }
});

// Save and close the modal for changing background color
bgChangeBtn.addEventListener("click", () => {
    const newBgColor = bgColorPicker.value || "url(" + bgImageInput.value + ")";
    saveBackground(newBgColor); // Save the background color/image
    document.body.style.background = newBgColor;
    bgModal.style.display = "none";
});

// Add bookmark function
function addBookmark(bookmarkValue) {
    const bookmarks = loadBookmarksFromStorage();
    // Make sure the URL starts with 'http' or 'https'
    if (!bookmarkValue.startsWith("http") && !bookmarkValue.startsWith("https")) {
        bookmarkValue = "https://" + bookmarkValue; // Default to https
    }
    bookmarks.push({ name: bookmarkNameInput.value, url: bookmarkValue });
    localStorage.setItem(currentPreset, JSON.stringify(bookmarks));
    loadBookmarks();
}

// Load bookmarks from localStorage
function loadBookmarks(searchTerm = "") {
    const bookmarks = loadBookmarksFromStorage();
    const bookmarksContainer = document.querySelector(".bookmarks");
    bookmarksContainer.innerHTML = "";

    const filteredBookmarks = bookmarks.filter(bookmark =>
        bookmark.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredBookmarks.forEach((bookmark, index) => {
        const bookmarkItem = document.createElement("div");
        bookmarkItem.classList.add("bookmark-item");

        const bookmarkLink = document.createElement("a");
        bookmarkLink.href = bookmark.url;
        bookmarkLink.target = "_blank";
        bookmarkLink.textContent = bookmark.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteBookmark(index);
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            const newBookmark = prompt("Edit bookmark URL:", bookmark.url);
            const newBookmarkName = prompt("Edit bookmark Name:", bookmark.name);
            if (newBookmark) {
                editBookmark(index, newBookmark, newBookmarkName);
            }
        });

        bookmarkItem.appendChild(bookmarkLink);
        bookmarkItem.appendChild(deleteButton);
        bookmarkItem.appendChild(editButton);

        bookmarksContainer.appendChild(bookmarkItem);
    });
}

// Delete bookmark function
function deleteBookmark(index) {
    const bookmarks = loadBookmarksFromStorage();
    bookmarks.splice(index, 1);
    localStorage.setItem(currentPreset, JSON.stringify(bookmarks));
    loadBookmarks();
}

// Edit bookmark function
function editBookmark(index, newValue, newName) {
    const bookmarks = loadBookmarksFromStorage();
    // Make sure the URL starts with 'http' or 'https'
    if (!newValue.startsWith("http") && !newValue.startsWith("https")) {
        newValue = "https://" + newValue; // Default to https
    }
    bookmarks[index].url = newValue;
    bookmarks[index].name = newName;
    localStorage.setItem(currentPreset, JSON.stringify(bookmarks));
    loadBookmarks();
}

// Helper function to safely load bookmarks from localStorage
function loadBookmarksFromStorage() {
    const storedData = localStorage.getItem(currentPreset);
    try {
        return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
        console.error("Error loading bookmarks from localStorage", e);
        return []; // Return an empty array if parsing fails
    }
}

// Function to save the background color or image to localStorage
function saveBackground(color) {
    localStorage.setItem("backgroundColor", color);
}

// Function to load the background color or image from localStorage
function loadBackground() {
    const storedColor = localStorage.getItem("backgroundColor");
    if (storedColor) {
        document.body.style.background = storedColor;
    }
}

// Search bookmarks by name
const searchInput = document.getElementById("searchBookmarks");
searchInput.addEventListener("input", () => {
    loadBookmarks(searchInput.value);
});
