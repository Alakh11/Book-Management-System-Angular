import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  //book = [];
  books : Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Fetch book data (static for now)
    this.bookService.getBooks().subscribe(books => {
    this.books = this.books;[
      { title: 'Book 1', author: 'Author 1', genre: 'Fiction' },
      { title: 'Book 2', author: 'Author 2', genre: 'Non-fiction' }

    ];
    console.log(books.length); // Get the number of books
    //books.push(newBook); // Add a new book to the array
  })
  }
}
