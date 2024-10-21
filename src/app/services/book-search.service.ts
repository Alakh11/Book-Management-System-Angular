// src/app/services/book-search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookSearchService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyCac6ljbdZVZXukJ6L3U5klaDM5_Yg8fYE';
  searchQuery: any;
  bookSearchService: any;
  searchResults: never[] | undefined;
  

  constructor(private http: HttpClient) {}

  searchBooks(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
    if (this.searchQuery.trim()) {
      this.bookSearchService.searchBooks(this.searchQuery).subscribe((data: { docs: never[]; }) => {
        this.searchResults = data.docs || []; // Default to empty array if docs is undefined
      }, (error: any) => {
        console.error('Search Error:', error); // Log errors if the API call fails
      });
    } else {
      this.searchResults = [];
    }

    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}`;
    console.log('API Call:', url); // Log the URL being called
    return this.http.get<any>(url).pipe(
      tap(data => console.log('API Response:', data)) // Log the response
    );
  }
}
