import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})

export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  book: Book = { id: 0, title: '', author: '', genre: '' }; 
  constructor(private fb: FormBuilder, private bookService: BookService) {
    this.bookForm = this.fb.group({
      title: [''],
      author: [''],
      genre: [''], 
      publishedYear: [''],
      isbn: ['']
    });
  }
  ngOnInit(): void {
      
  }
  
  submitForm() {
    const newBook = this.bookForm.value;
    this.bookService.addBook(newBook).subscribe((response: any) => {
      console.log('Book added!', response);
      this.bookForm.reset();
    });
  }
}
