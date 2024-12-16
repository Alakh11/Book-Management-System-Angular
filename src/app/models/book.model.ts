//book.model.ts
export interface Book {
    id :  number;     // the id of the book
    title: string;   // The title of the book
    author:  { name: string } | null; // The author of the book
    genre: string;   // The genre of the book
    publishedYear?: number; // Year the book was published
    isbn?: string;          // ISBN number
  }