class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        // Create tr element
         const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</td>
        `;
        list.appendChild(row);
    }

    showAlert(message, className){
        // Check if there is an alert
        if(document.querySelector('.error')){
            document.querySelector('.error').remove();
        }
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div, form);
        // Timeout after 3 sec
        setTimeout(function(){
            if(document.querySelector('.alert')){
                document.querySelector('.alert').remove();
            }
        }, 3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = ''
    }
}

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = this.getBooks();

        // Instantiate UI
        const ui = new UI();

        books.forEach(function(book){
            // Add book to list
            ui.addBookToList(book);
        });

        /*
        for(let i = 0; i < 2; i++){
                // Add book to list
                ui.addBookToList(books[i]);
        }
        */
    }

    static addBook(book){
        
        // Gets books from LS
        const books = this.getBooks();
        // Adds another book to books
        books.push(book);
        // Sets LS books to books
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = this.getBooks();
        
        books.forEach(function(book, index){
            if (book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit',
    function(e){
        // Get form values
        const title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value;

            
        // Instantiate book
         const book = new Book(title, author, isbn);
            
        // Instantiate UI
        const ui = new UI();

        // Validate
        if(title && author && isbn){
            // Add book to list
            ui.addBookToList(book);

            // Add to LS
            Store.addBook(book);

            // Show success
            ui.showAlert('Book Added!', 'success');
            
            // Clear fields
            ui.clearFields();
        }else{
            // Error alert
            ui.showAlert('Please fill in all fields.', 'error');
        }
        
        e.preventDefault();
});

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    
    const ui = new UI();

    // Delete book
    ui.deleteBook(e.target);

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    if(e.target.className === 'delete'){
        // Show message
        ui.showAlert('Book Removed!', 'success');
    }

    e.preventDefault();
});