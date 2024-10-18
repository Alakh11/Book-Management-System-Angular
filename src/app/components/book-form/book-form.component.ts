import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})

export class BookFormComponent {
  bookForm: FormGroup;

  constructor(private fb: FormBuilder, private bookService: BookService) {
    this.bookForm = this.fb.group({
      title: [''],
      author: [''],
      genre: ['']
    });
  }

  submitForm() {
    this.bookService.addBook(this.bookForm.value).subscribe(response => {
      console.log('Book added!', response);
    });
  }
}
