import { Component, OnInit } from '@angular/core';
import Author from 'src/app/models/Author';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  // ListAuthors: Author[] = [];
    ListAuthors: Author[] = [
    {name: "Gabrien Gabo", lastName: "Marquez", country: "Colombia"},
    {name: "Gabrien Gabo", lastName: "Marquez", country: "Colombia"},
    {name: "Gabrien Gabo", lastName: "Marquez", country: "Colombia"},
    {name: "Gabrien Gabo", lastName: "Marquez", country: "Colombia"},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
