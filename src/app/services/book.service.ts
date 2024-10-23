import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})

export class BookService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  //private localApiUrl = 'http://localhost:4200/books';

  // Subject to manage local books in memory
  private booksSubject = new BehaviorSubject<Book[]>([]);
  googleBooksApiUrl: any;

  constructor(private http: HttpClient) {}

  // Search books using Google Books API
  searchBooks(query: string): Observable<any> {
    return this.http.get<any>(`${this.googleBooksApiUrl}?q=${encodeURIComponent(query)}`);
  }


  // Get books from your local backend or in-memory
  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable(); // For in-memory book management
    // return this.http.get<Book[]>(this.localApiUrl); // If you're using a local backend
  }


  // Add a book to the in-memory collection or local backend
  addBook(book: Book): void {
    const currentBooks = this.booksSubject.value;
    book.id = this.generateId(); // Generate unique ID
    this.booksSubject.next([...currentBooks, book]);

    // For local backend
    // return this.http.post<Book>(this.localApiUrl, book);
  }

  // Delete a book from in-memory or local backend
  deleteBook(id: number): void {
    const currentBooks = this.booksSubject.value.filter(book => book.id !== id);
    this.booksSubject.next(currentBooks);

    // For local backend
    // return this.http.delete(`${this.localApiUrl}/${id}`);
  }

  // Generate unique ID for in-memory books
  private generateId(): number {
    const currentBooks = this.booksSubject.value;
    return currentBooks.length ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1;
  }
}
