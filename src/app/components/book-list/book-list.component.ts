import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { BookSearchService } from 'src/app/services/book-search.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books=[];
  //books: Book[] = [];
  searchQuery: string = '';
  searchResults: any[] = [];
  apiUrl: string = 'https://openlibrary.org/search.json';
  loading: boolean = false; // Indicator for loading state
  errorMessage: string = ''; // For displaying error message

  constructor(private http: HttpClient, private bookSearchService: BookSearchService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.http.get('http://localhost:5001/api/books')
      .subscribe(
        (data: any) => {
          this.books = data;
          console.log('Books:', this.books);
        },
        (error) => {
          console.error('Error fetching books:', error);
        }
      );
  }

  addBook(book): void {
    this.http.post('http://localhost:5001/api/books', book)
      .subscribe(
        (data) => {
          console.log('New book added:', data);
        },
        (error) => {
          console.error('Error adding book:', error);
        }
      );
  }
  

  // Fetching books from a local source or service
  /*getBooks(): void {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    }
  }*/

  // Search for books using Open Library API
  searchBooks(): void {
    if (!this.searchQuery) {
      this.errorMessage = 'Please enter a search query.';
      return; // If the search query is empty, show an error message
    }

    this.loading = true; // Start loading
    this.errorMessage = ''; // Clear any previous error messages

    const query = encodeURIComponent(this.searchQuery);
    const searchUrl = `${this.apiUrl}?q=${query}`;

    this.http.get(searchUrl).subscribe(
      (response: any) => {
        this.loading = false; // Stop loading when response is received
        console.log('API Response:', response); // Debugging log to see the response

        if (response && response.docs) {
          this.searchResults = response.docs.map((item: any) => ({
            title: item.title,
            author_name: Array.isArray(item.author_name) ? item.author_name.join(', ') : 'Unknown',
            genre: item.genre,
            first_publish_year: item.first_publish_year,
            isbn: item.isbn ? item.isbn[0] : 'Unknown'
          }));
          console.log('Search Results:', this.searchResults); // Check if `searchResults` is populated
          this.cdr.markForCheck(); // Trigger change detection if needed
        } else {
          this.searchResults = [];
          this.errorMessage = 'No results found for your search.';
        }
      },
      (error) => {
        this.loading = false; // Stop loading on error
        this.searchResults = [];
        this.errorMessage = 'There was an error retrieving book data. Please try again later.'; // Show user-friendly error message
        console.error('Error searching books:', error); // Log error to the console
      }
    );
  }
}
