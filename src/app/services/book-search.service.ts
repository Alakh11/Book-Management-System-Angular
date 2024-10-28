import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Book {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
}

export interface SearchResponse {
  docs: Book[];
  num_found: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {
  private apiUrl = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<SearchResponse> {
    if (!query.trim()) {
      return new Observable(observer => {
        observer.next({ docs: [], num_found: 0 });
        observer.complete();
      });
    }

    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
    console.log('API Call:', url); // Log the URL being called
    
    return this.http.get<SearchResponse>(url).pipe(
      tap(data => console.log('API Response:', data)), // Log the response
      catchError(this.handleError<SearchResponse>('searchBooks', { docs: [], num_found: 0 })) // Graceful error handling
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
