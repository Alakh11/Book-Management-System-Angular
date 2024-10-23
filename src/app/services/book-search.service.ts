// src/app/services/book-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  searchQuery: any;
  bookSearchService: any;
  searchResults: never[] | undefined;
  

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<any> {
    if (!query.trim()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&key=AIzaSyCac6ljbdZVZXukJ6L3U5klaDM5_Yg8fYE`;
    console.log('API Call:', url); // Log the URL being called
    
    return this.http.get<any>(url).pipe(
      tap(data => console.log('API Response:', data)) // Log the response
    );
  }
}

