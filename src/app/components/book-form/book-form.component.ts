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
  book = {
    title: '',
    author: '',
    genre: '',
    publishedYear: 0,
    isbn: ''
  };

  constructor(private fb: FormBuilder, private bookService: BookService) {
    // Adding validators for required fields
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required], 
      publishedYear: [null, [Validators.required, Validators.pattern(/^\d+$/)]], 
      isbn: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]]
    });
  }


  addBook() {
    if (this.bookForm.valid) {
    const bookData = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author, 
      genre: this.bookForm.value.genre,  
      publishedYear: +this.bookForm.value.publishedYear, 
     // publishedYear: this.bookForm.value.publishedYear,
      isbn: this.bookForm.value.isbn,
      authorId: +this.bookForm.value.author, // Ensure it matches the schema
      categoryId: +this.bookForm.value.categoryId || null // Optional field
    };
    
    this.bookService.addBook(bookData).subscribe({
      next: (response) => {
        console.log('Book added successfully:', response);
        this.books.push(response); // Update local array with backend response
        this.message = 'Book added successfully!';
        this.bookForm.reset(); // Reset form after success
        alert('Book added successfully!');
      },
      error: (err) => {
        console.error('Error adding book:', err);
        alert('Failed to add book. Please check the console for details.');
      }
    });
  }else {
    this.message = 'Please fill in all fields correctly.';
  }
}

  ngOnInit(): void {
    const storedBooks = localStorage.getItem('books');
    this.loadBooksFromLocalStorage();
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    }

  }
        // Getter for easy access to form controls
        get f() { 
          return this.bookForm.controls;
         }

         onSubmit() {
          if (this.book && typeof this.book.publishedYear === 'string') {
            this.book.publishedYear = Number(this.book.publishedYear);
          }
          this.bookService.addBook(this.book).subscribe(
            response => {
            console.log('Book added:', response);
            // Handle response (e.g., show a success message)
          },
          error => {
            console.error('Error adding book:', error);
            // Handle error (e.g., show an error message)
          }
        );
        }

submitForm()  {
  // Check if the form is valid before submitting
  if (this.bookForm.valid) {
    const bookData = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      genre: this.bookForm.value.genre,
      publishedYear: this.bookForm.value.publishedYear,
      isbn: this.bookForm.value.isbn
    };
    bookData.publishedYear = Number(bookData.publishedYear);
    // Call the service to add the book
    this.bookService.addBook(bookData).subscribe({
      next: (response) => {
        console.log('Book added successfully:', response);
        this.books.push(response); // Update local array with backend response
        this.saveBooksToLocalStorage(); // Save updated books to local storage
        this.message = 'Book added successfully!';
        this.bookForm.reset(); // Reset form after success
      },
      error: (err) => {
        console.error('Error adding book:', err);
        this.message = 'Failed to add the book. Please try again.';
      }
    });
  } else {
    // If the form is invalid, set error message
    this.message = 'Please fill in all fields correctly.';
  }
}

// Save the books array to localStorage
saveBooksToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(this.books));
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
        console.log(response);
        this.searchResults = response;
        //this.searchResults = response.docs; // Assuming docs contains the array of books
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
  

// Generate unique ID for books
private generateId(): number {
  return this.books.length ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
}

// Edit a book
editBook(book: Book) {
  this.bookForm.patchValue({
    title: book.title,
    author: book.author, 
    genre: book.genre,   
    publishedYear: book.publishedYear,
    isbn: book.isbn
  }); // Populate the form with the book data
  this.editingBookId = book.id; // Set the editing book ID
}

// Delete a book
deleteBook(id: number) {
  this.books = this.books.filter(book => book.id !== id); // Remove the book from the array
  this.saveBooksToLocalStorage(); // Update localStorage
  this.message = 'Book deleted successfully!'; // Success message
}
}