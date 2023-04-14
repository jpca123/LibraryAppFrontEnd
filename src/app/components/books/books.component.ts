import { Component, OnInit } from '@angular/core';
import Book from 'src/app/models/Book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  // ListBooks: Book[] = [];
    ListBooks: Book[] = [
    {title: "Ejemplo", _id: "43h56jh45h6", pages: 456, authorId: "85784567", categoryId: "34h5h34h5jjol"},
    {title: "Ejemplo2", _id: "43h56jh45h6", pages: 456, authorId: "85784567", categoryId: "34h5h34h5jjol"},
    {title: "Ejemplo3", _id: "43h56jh45h6", pages: 456, authorId: "85784567", categoryId: "34h5h34h5jjol"},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
