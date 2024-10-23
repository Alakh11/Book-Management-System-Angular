// src/app/services/book-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<any> {
    if (!query.trim()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
    console.log('API Call:', url); // Log the URL being called
    
    return this.http.get<any>(url).pipe(
      tap(data => console.log('API Response:', data)), // Log the response
      catchError(this.handleError<any>('searchBooks', [])) // Graceful error handling
    );
  }
   // Error handling function
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // Log to console
      return of(result as T); // Return empty result on error
    };
}
}

