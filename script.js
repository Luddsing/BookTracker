let bookId = 0; // Global variable to assign unique IDs
let sortOrder = 'default'; // Global variable to keep track of the sort order

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = bookId++; // Assign a unique ID to each book
}

// Load books from local storage or initialize an empty array
const myLibrary = JSON.parse(localStorage.getItem('myLibrary')) || [];

function updateReadStatus(bookId, readStatus) {
    const book = myLibrary.find(b => b.id === bookId);
    if (book) {
        book.read = readStatus;
        saveToLocalStorage();
        displayBooks();
    }
}

function displayBooks() {
    const bookContainer = document.getElementById('bookContainer');
    bookContainer.innerHTML = '';

    // Sort the books based on read status
    const sortedBooks = myLibrary.slice().sort((a, b) => {
        if (sortOrder === 'default') {
            // Sort by original order
            return a.id - b.id;
        } else {
            // Sort by read status
            return a.read - b.read;
        }
    });

    sortedBooks.forEach((book) => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const titleElement = document.createElement('h1');
        titleElement.textContent = book.title;
        bookDiv.appendChild(titleElement);

        const authorElement = document.createElement('h2');
        authorElement.textContent = book.author;
        bookDiv.appendChild(authorElement);

        const pagesElement = document.createElement('h3');
        pagesElement.textContent = `Pages: ${book.pages}`;
        bookDiv.appendChild(pagesElement);

        // Create a div for buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        // Checkbox wrapper
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'checkbox-wrapper-10';

        // Checkbox input
        const checkbox = document.createElement('input');
        checkbox.className = 'tgl tgl-flip';
        checkbox.id = `cb-${book.id}`;
        checkbox.type = 'checkbox';
        checkbox.checked = book.read;

        // Update event listener
        checkbox.addEventListener('change', function() {
            updateReadStatus(book.id, this.checked);
        });

        // Label for checkbox
        const label = document.createElement('label');
        label.className = 'tgl-btn';
        label.setAttribute('data-tg-off', 'read it..');
        label.setAttribute('data-tg-on', 'read!');
        label.setAttribute('for', `cb-${book.id}`);

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        buttonsDiv.appendChild(checkboxWrapper);

        // Button to remove book
        const removeBookBtn = document.createElement('button');
        removeBookBtn.textContent = 'Remove Book';
        removeBookBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to remove this book?")) {
                myLibrary.splice(myLibrary.indexOf(book), 1);
                saveToLocalStorage();
                displayBooks();
            }
        });

        buttonsDiv.appendChild(removeBookBtn);
        bookDiv.appendChild(buttonsDiv);

        bookContainer.appendChild(bookDiv);
    });
}



function saveToLocalStorage() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Function to open dialog and blur background
function openDialog() {
    document.getElementById('bookFormDialog').showModal();
    document.getElementById('mainContent').classList.add('blur-background');
}

// Function to close dialog and remove blur
function closeDialog() {
    document.getElementById('bookFormDialog').close();
    document.getElementById('mainContent').classList.remove('blur-background');
}

// Event listener for adding a new book
document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read').checked;

    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);

    saveToLocalStorage();
    displayBooks();

    document.getElementById('bookForm').reset();
    closeDialog();
});

// Event listener to show the book form dialog
document.getElementById('addBookBtn').addEventListener('click', openDialog);

// Event listener for the "Sort by read status" button
document.querySelector('.sortBtn').addEventListener('click', () => {
    // Toggle the sort order
    sortOrder = sortOrder === 'default' ? 'byReadStatus' : 'default';
    // Update the button text
    const sortBtn = document.querySelector('.sortBtn');
    sortBtn.textContent = sortOrder === 'default' ? 'Sort by read status' : 'Sort by original order';
    // Redisplay the books
    displayBooks();
});

// Initial display of books
displayBooks();
