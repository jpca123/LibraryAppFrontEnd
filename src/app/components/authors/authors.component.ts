import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import Author from 'src/app/models/Author';
import { ShowInfoTypes } from 'src/app/models/types';
import AuthorService from 'src/app/services/author.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  private authorService: AuthorService;

  title: string = "Autores";
  ListAuthors: Author[] = [];

  InfoCreateEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>(); 
  InfoUpdateEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>(); 
  InfoUserEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>(); 

  private limit: number = 5;
  private page: number = 1;
  private cuantity: number = this.limit * 2;
  canLoadMore: boolean = this.cuantity > (this.limit * (this.page - 1));


  AuthorCreate: Author = new Author();
  AuthorUpdate: Author = new Author();

  constructor(private elRef: ElementRef, authorServ: AuthorService) {
    this.authorService = authorServ;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.authorService.getAll(this.page, this.limit).subscribe((data: any) => {
      if (data.data) this.ListAuthors = this.ListAuthors.concat(data.data);
      if (data.paginator) this.cuantity = data.paginator.cuantity;

      if(data.ok) this.page += 1;
      this.canLoadMore = this.cuantity > (this.limit * (this.page - 1));

    }, (err: any) => {
      console.warn("Fallo la carga", err)
      this.InfoUserEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  create(): void {
    let object: Author = Object.assign({}, this.AuthorCreate);
    object._id = `${this.ListAuthors.length}`;

    this.authorService.create(this.AuthorCreate).subscribe((data: any) => {
      if (data.data) this.ListAuthors.push(data.data);
      this.AuthorCreate = new Author();
    }, (err: any) => {
      console.warn("fallo la creacion", err);
      this.InfoCreateEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  update(): void {
    let id: string | undefined = this.AuthorUpdate._id;
    if (!id) return;

    let objectInList: Author | undefined = this.ListAuthors.find((author: Author) => author._id === id);
    if (!objectInList) return;

    this.authorService.update(id, this.AuthorUpdate).subscribe((data: any) => {
      if (data.data) {
        let objectUpdated: Author = data.data as Author;

        let indexObject: number = this.ListAuthors.findIndex(author => author._id === id);
        if (indexObject < 0) return console.log("no se encontro el objeto de update en la lista");

        this.ListAuthors[indexObject] = data.data;
        this.AuthorUpdate = new Author();
      }
    }, (err: any) => {
      this.AuthorUpdate = new Author();
      this.InfoUpdateEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  delete(): void {
    let id: string | undefined = this.AuthorUpdate._id;
    if (!id) return;

    let indexObject: number = this.ListAuthors.findIndex((book: Author) => book._id === id);
    if (indexObject === -1) return;

    this.authorService.delete(id).subscribe((data: any) => {
      if (data.ok) this.ListAuthors.splice(indexObject, 1);
      this.AuthorUpdate = new Author();
    }, (err: any) => {
      console.log("fallo la eliminacion", err);
      this.InfoUserEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    });
  }

  loadUpdate(id?: string): void {
    if (!id) return;

    let object: Author | undefined = this.ListAuthors.find((book: Author) => book._id === id);
    if (!object) return;

    this.AuthorUpdate = Object.assign({}, object);
  }
}