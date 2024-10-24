import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
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
  book: Book = { id: 0, title: '', author: '', genre: '', publishedYear: '', isbn: ''}; 

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

submitForm() {
  // Check if the form is valid before submitting
  if (this.bookForm.valid) {
        
          const newBook = { ...this.bookForm.value }; // Create a new book object
          newBook.id = this.generateId(); // Generate unique ID
    
          this.books.push(newBook);  // Add the book to the local array for display
          this.saveBooksToLocalStorage();  // Save to localStorage
    
        this.message = 'Book successfully added!'; // Success message
        this.bookForm.reset(); // Reset the form on success
        (error) => {
           console.error('Error adding book:', error);
           this.message = 'Failed to add the book. Please try again.'; // Error message
      }
     } else {
    // If the form is invalid, set error message
    this.message = 'Please fill in all fields correctly.';
  }
}

// Save the books array to localStorage
saveBooksToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(this.books));
}
  

// Generate unique ID for books
private generateId(): number {
  return this.books.length ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
}
}