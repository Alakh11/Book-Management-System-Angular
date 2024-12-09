//book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { environment } from '../environements';

export interface SearchResponse {
  docs: Book[];
  num_found: number;
}


@Injectable({
  providedIn: 'root'
})
export class BookService {
 // private apiUrl = `${environment.apiBaseUrl}/books`; // Backend API endpoint
  private apiUrl = 'http://127.0.0.1:3000/books';
  //private apiUrl = 'http://localhost:5001/api/books';
  //private apiUrl = 'https://openlibrary.org/search.json';

  // Subject to manage local books in memory
  private booksSubject = new BehaviorSubject<Book[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // Fetch all books from the backend
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching books:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  // Add a new book
  addBook(book: Partial<Book>): Observable<Book> {
    const url = 'http://127.0.0.1:3000/books';
    return this.http.post<Book>(this.apiUrl, book).pipe(
      tap(response => console.log('Book added:', response)),
      catchError(error => {
        console.error('Error adding book:', error);
        throw error; // Propagate the error for further handling
      })
    );
  }

  // Search books by query (if supported by the backend)
  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search?query=${query}`).pipe(
      catchError(error => {
        console.error('Error searching books:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  // Delete a book by ID
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Book with ID ${id} deleted`)),
      catchError(error => {
        console.error(`Error deleting book with ID ${id}:`, error);
        throw error; // Propagate the error for further handling
      })
    );
  }

  // In-memory book management for UI
  getLocalBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  // Add a book to the in-memory collection
  addLocalBook(book: Book): void {
    const currentBooks = this.booksSubject.value;
    this.booksSubject.next([...currentBooks, book]);
  }

  // Generate a unique ID for in-memory books
  private generateId(): number {
    const currentBooks = this.booksSubject.value;
    return currentBooks.length ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1;
  }
}
