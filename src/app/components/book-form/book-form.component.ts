import { Component } from '@angular/core';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  book = { title: '', author: '', genre: '' };

  submitForm() {
    // Logic to add/edit a book
    console.log(this.book);
  }
}
