import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import Author from 'src/app/models/Author';
import Book from 'src/app/models/Book';
import Category from 'src/app/models/Category';
import { ShowInfoTypes } from 'src/app/models/types';
import AuthorService from 'src/app/services/author.service';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  private bookService: BookService;
  private categoryService: CategoryService;
  private authorService: AuthorService;

  title: string = "Libros";
  ListBooks: Book[] = [];
  ListAuthors: Author[] = [];
  ListCategories: Category[] = [];
  ListFavorites: Object[] = [];
  InfoCreateEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>();
  InfoUpdateEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>();
  InfoGeneralEmitter = new EventEmitter<{type: ShowInfoTypes, data: any}>();

  BookCreate: Book = new Book();
  BookUpdate: Book = new Book();
  BookView: Book = new Book();
  BookViewFavorite: boolean = false;

  private limit: number = 10;
  private page: number = 1;
  private cuantity: number = this.limit * 2;
  canLoadMore: boolean = true;

  constructor(
    private elRef: ElementRef,
    bookServ: BookService,
    categoryServ: CategoryService,
    authorServ: AuthorService,
  ) {
    this.categoryService = categoryServ;
    this.authorService = authorServ;
    this.bookService = bookServ;
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
    this.loadAuthors();
    this.loadFavourites();
  }

  getCategory(id?: string) {
    if (!id) {
      return "Desconocido";
    }
    let category: Category | undefined = this.ListCategories.find((el: Category) => el._id === id);
    if (!category) {
      return "Desconocido";
    };
    return category.category;
  }

  getAuthor(id?: string) {
    if (!id) {
      return "Desconocido";
    }
    let author: Author | undefined = this.ListAuthors.find((el: Author) => el._id === id);
    if (!author) {
      return "Desconocido";
    };
    return `${author.name} ${author.lastName}`;
  }

  loadData() {
    this.bookService.getAll(this.page, this.limit).subscribe((data: any) => {
      if (data.data) this.ListBooks = this.ListBooks.concat(data.data);

      if (data.paginator) this.cuantity = data.paginator.cuantity;
      this.canLoadMore = this.cuantity > (this.limit * this.page);
      if(data.ok) this.page += 1;
    }, (err: any) => {
      console.warn("Fallo loadData", err)
      this.InfoGeneralEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  loadAuthors() {
    this.authorService.getAll(1, 1000).subscribe((data: any) => {
      if (data.data) {
        this.ListAuthors = this.ListAuthors.concat(data.data);
      }
    }, (err: any) => {
      console.warn("fallo loadAuthors", err);
      this.InfoGeneralEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  loadCategories() {
    this.categoryService.getAll(1, 1000).subscribe((data: any) => {
      if (data.data) {
        this.ListCategories = this.ListCategories.concat(data.data);
      }
    }, (err: any) => {
      console.warn("fallo loadCategories", err);
      this.InfoGeneralEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  loadFavourites(){
    this.bookService.getFavorites(1, 100).subscribe((data: any)=>{
      if(data.ok){
       return this.ListFavorites = data.data;
      }
    }, (err: any)=>{
      console.warn("fallo getAll fovourites", err)
      this.InfoGeneralEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  onSubmitCreate(event: any) {
    event.preventDefault();

    this.BookCreate.poster = event.target.poster.files[0];
    this.BookCreate.document = event.target.document.files[0];

    let errors: string[] = this.validData(this.BookCreate);
    let formData: FormData = new FormData(event.target);

    if (errors.length > 0) {
      this.InfoCreateEmitter.emit({type: ShowInfoTypes.ERROR, data:errors})
    }
    else {
      this.create(formData);
      event.target.reset();
    }
  }

  onSubmitUpdate(event: any){
    event.preventDefault();

    this.BookUpdate.poster = event.target.poster.files[0];
    this.BookUpdate.document = event.target.document.files[0];

    let errors: string[] = this.validData(this.BookUpdate);
    let formData: FormData = new FormData(event.target);

    formData.set("_id", this.BookUpdate._id || "");
    if (errors && errors.length > 0) {
      this.InfoUpdateEmitter.emit({type: ShowInfoTypes.ERROR, data: errors})

    }
    else {
      this.update(formData);
      event.target.reset();
    }
  }

  validData(book: Book): string[] {
    let result: string[] = [];
    if (!book.title) result.push("Debe incluir el titulo");
    if (book.title && book.title.length < 3) result.push("El titulo debe ser de minimo 3 caracteres");
    if (!book.categoryId) result.push("El libro debe tener una categoria");
    if (!book.authorId) result.push("El libro debe tener un autor");
    // demas validaciones
    return result;
  }

  create(formData: FormData): void {
    this.bookService.create(formData).subscribe((data: any) => {
      if (data.data) this.ListBooks.push(data.data);
      this.resetCreate();

    }, (err: any) => {
      console.warn("fallo creacion", err)
      this.InfoCreateEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
    })
  }

  update(formData: FormData): void {
    let id: string | undefined = formData.get("_id") as string;
    if (!id) return;

    let objectinList = this.ListBooks.find(el => el._id === id);

    this.bookService.update(id, formData).subscribe((data: any) => {
      if (data.data) {
        let bookUpdated: Book = data.data as Book;
        let indexBook: number = this.ListBooks.findIndex((book: Book) => book._id === id);

        this.ListBooks[indexBook] = bookUpdated;
        this.resetUpdate();
      }
    }, (err: any) => {
      this.InfoUpdateEmitter.emit({type: ShowInfoTypes.ERROR, data: err});
      console.warn("fallo update", err)
    })
  }

  deleteBook(): void {
    let id: string | undefined = this.BookUpdate._id;
    if (!id) return;

    this.bookService.delete(id).subscribe((data: any) => {
      if (data.ok) {
        let indexBook: number = this.ListBooks.findIndex((book: Book) => book._id === id);
        if (indexBook === -1) return console.warn("no se encontro delete", id);
        this.ListBooks.splice(indexBook, 1);
        this.resetUpdate();
      }
    }, (err: any) => {
      console.warn("fallo eliminacion", err);
      this.InfoGeneralEmitter.emit(err.error.errors);
    })
  }

  loadUpdate(id?: string): void {
    if (!id) return;

    let Book: Book | undefined = this.ListBooks.find((book: Book) => book._id === id);
    if (!Book) return;

    this.BookUpdate = Object.assign({}, Book);
  }

  setFavorite(id?: string){
    if(!id) return alert("no id para añadir a favoritos")

    this.bookService.setFavorite(id).subscribe((data: any)=>{
      if(data.ok){
        this.ListFavorites.push({bookId: id});
        this.BookViewFavorite = true;
        return console.log("se añadio con exito");
      }
      console.log("fallo la adicion a favoritos")
    }, (err: any)=>{
      console.log("fallo la adicion a favoritos", err);
    })
  }

  removeFavorite(id?: string){
    if(!id) return alert("no id para remover de favoritos")

    this.BookViewFavorite = false;
    this.bookService.removeFavorite(id).subscribe((data: any)=>{
      if(data.ok){
        return console.log("se removio con exito");
      }
      console.log("fallo la adicion a favoritos")
    }, (err: any)=>{
      console.log("fallo la adicion a favoritos", err);
    })
  }

  loadView(id?: string): void {
    if (!id) return;

    let Book: Book | undefined = this.ListBooks.find((book: Book) => book._id === id);
    if (!Book) return;

    this.BookViewFavorite = this.ListFavorites.some((book: any)=> book.bookId === id);
    console.log('libro favorito', this.BookViewFavorite)
    this.BookView = Object.assign({}, Book);
  }

  resetCreate() {
    this.BookCreate = new Book();
  }

  resetUpdate() {
    this.BookUpdate = new Book();
  }


}
