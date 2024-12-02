import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { BookSearchService } from 'src/app/services/book-search.service';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})

export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  message: string = '';
  books: Book[] = [];  // Store added books here
  searchResults: any[] = []; // Store search results
  //book: Book = { id: 0, title: '', author: '', genre: '', publishedYear: '', isbn: ''}; 
  editingBookId: number | null = null; // Track the ID of the book being edited
  book = { id: '', title: '', author: '', category: '' };


  constructor(private fb: FormBuilder, private bookService: BookService) {
    // Adding validators for required fields
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required], 
      publishedYear: ['', [Validators.required]], 
      isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]]
    });
  }

  ngOnInit(): void {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    }

  }
        // Getter for easy access to form controls
        get f() { 
          return this.bookForm.controls;
         }

         onSubmit() {
          this.bookService.addBook(this.book).subscribe(response => {
            console.log('Book added:', response);
            // Handle response (e.g., show a success message)
          });
        }

submitForm() {
  // Check if the form is valid before submitting
  if (this.bookForm.valid) {
        
          const newBook = { ...this.bookForm.value }; // Create a new book object
          newBook.id = this.editingBookId !== null ? this.editingBookId : this.generateId(); // Use existing ID if editing

          if (this.editingBookId !== null) {
            // Update existing book
            const index = this.books.findIndex(book => book.id === this.editingBookId);
            if (index !== -1) {
              this.books[index] = newBook; // Update the book in the array
            } 
            this.message = 'Book successfully updated!'; // Success message
          } else {
          this.books.push(newBook);  // Add the book to the local array for display
          this.message = 'Book successfully added!'; // Success message
            }
    
        
        (error) => {
           console.error('Error adding book:', error);
           this.message = 'Failed to add the book. Please try again.'; // Error message
      }
      this.saveBooksToLocalStorage();  // Save to localStorage
      this.bookForm.reset(); // Reset the form on success
      this.editingBookId = null; // Reset editing ID
     } else {
    // If the form is invalid, set error message
    this.message = 'Please fill in all fields correctly.';
  }
}

 // Load books from local storage
 loadBooksFromLocalStorage() {
  const storedBooks = localStorage.getItem('books');
  if (storedBooks) {
    this.books = JSON.parse(storedBooks);
  }
}

  // Search books using Open Library API
  searchBooks(query: string) {
    if (query) {
      this.bookService.searchBooks(query).subscribe(response => {
       // this.searchResults = response.docs; // Assuming docs contains the array of books
      }, error => {
        console.error('Error searching books:', error);
        this.message = 'Failed to fetch search results. Please try again.';
      });
    } else {
      this.searchResults = []; // Clear search results if query is empty
    }
  }

  // Add book from search results
  addBookFromSearch(book: any) {
    const newBook: Book = {
      id: this.generateId(),
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      genre: 'Unknown', // You may want to prompt the user to select a genre
      publishedYear: book.first_publish_year ? book.first_publish_year.toString() : 'Unknown',
      isbn: 'Unknown' // You may want to prompt the user for ISBN or leave it as Unknown
    };

    this.books.push(newBook);
    this.saveBooksToLocalStorage(); // Save to local storage
    this.message = 'Book added from search results!'; // Success message
  }


// Save the books array to localStorage
saveBooksToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(this.books));
}
  

// Generate unique ID for books
private generateId(): number {
  return this.books.length ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
}

// Edit a book
editBook(book: Book) {
  this.bookForm.patchValue(book); // Populate the form with the book data
  this.editingBookId = book.id; // Set the editing book ID
}

// Delete a book
deleteBook(id: number) {
  this.books = this.books.filter(book => book.id !== id); // Remove the book from the array
  this.saveBooksToLocalStorage(); // Update localStorage
  this.message = 'Book deleted successfully!'; // Success message
}
}