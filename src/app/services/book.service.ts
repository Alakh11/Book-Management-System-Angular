import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Book } from '../models/book.model';

export interface SearchResponse {
  docs: Book[];
  num_found: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://openlibrary.org/search.json';

  // Subject to manage local books in memory
  private booksSubject = new BehaviorSubject<Book[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // Search books using Open Library API
  searchBooks(query: string): Observable<SearchResponse> {
    this.loadingSubject.next(true);
    return this.http.get<SearchResponse>(`${this.apiUrl}?q=${encodeURIComponent(query)}`).pipe(
      tap(() => this.loadingSubject.next(false)), // Stop loading on success
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching books:', error);
        return of({ docs: [], num_found: 0 }); // Return a default value on error
      })
    );
  }

  // Get books from your local backend or in-memory
  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable(); // For in-memory book management
  }

  // Add a book to the in-memory collection or local backend
  addBook(book: Book): void {
    const currentBooks = this.booksSubject.value;
    book.id = this.generateId(); // Generate unique ID
    this.booksSubject.next([...currentBooks, book]);
  }

  // Delete a book from in-memory or local backend
  deleteBook(id: number): void {
    const currentBooks = this.booksSubject.value.filter(book => book.id !== id);
    this.booksSubject.next(currentBooks);
  }

  // Generate unique ID for in-memory books
  private generateId(): number {
    const currentBooks = this.booksSubject.value;
    return currentBooks.length ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1;
  }
}
