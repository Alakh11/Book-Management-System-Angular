import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books = [];

  ngOnInit(): void {
    // Fetch book data (static for now)
    this.books = [
      { title: 'Book 1', author: 'Author 1', genre: 'Fiction' },
      { title: 'Book 2', author: 'Author 2', genre: 'Non-fiction' }
    ];
  }
}
