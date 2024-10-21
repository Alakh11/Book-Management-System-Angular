import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})

export class BookService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyCaZSmx0AKRJeRVhLfUUejJWZ1s1nJsK38';
  booksSubject: any;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book[]): Observable<Book[]> {
    return this.http.post<Book[]>(this.apiUrl, book);

  }

  deleteBook(id: number) {
    const currentBooks = this.booksSubject.value.filter((book: { id: number; }) => book.id !== id);
    this.booksSubject.next(currentBooks);
  }

  private generateId(): number {
    return this.booksSubject.value.length ? Math.max(this.booksSubject.value.map(b => b.id)) + 1 : 1;

}
}
