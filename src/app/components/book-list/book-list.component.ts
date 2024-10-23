import { Component, OnInit } from '@angular/core';
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
  book = [];
  books : any[] = [];
  searchQuery: string = '';
  searchResults: any[] = [];
  apiUrl: string = 'https://www.googleapis.com/book/v1/volumes'
  loading: boolean = false; // Indicator for loading state
  errorMessage: string = ''; // For displaying error message

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getBooks();
  }
   // Fetching books from a local source or service
  getBooks(): void {
    // Example: Hardcoded local books, replace with your service logic if needed
    this.books = [];
  }

  // Search for books using Google Books API (or any other API)
  searchBooks(): void {
    if (!this.searchQuery) {
      this.errorMessage = 'Please enter a search query.';
      return; // If the search query is empty, show an error message
    }

    this.loading = true; // Start loading
    this.errorMessage = ''; // Clear any previous error messages

    const query = encodeURIComponent(this.searchQuery);
    const searchUrl = `${this.apiUrl}${query}`;

    this.http.get(searchUrl).subscribe(
      (response: any) => {
        this.loading = false; // Stop loading when response is received
        if (response && response.items) {
          this.searchResults = response.items.map((item: any) => {
            return {
              title: item.volumeInfo.title,
              author_name: item.volumeInfo.authors,
              first_publish_year: item.volumeInfo.publishedDate,
              isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers.map(id => id.identifier) : []
            };
          });
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