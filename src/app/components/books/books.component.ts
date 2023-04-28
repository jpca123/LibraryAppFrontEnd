import { Component, ElementRef, OnInit } from '@angular/core';
import Author from 'src/app/models/Author';
import Book from 'src/app/models/Book';
import Category from 'src/app/models/Category';
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

  BookCreate: Book = new Book();
  BookUpdate: Book = new Book();

  private limit: number = 2;
  private page: number = 1;
  private cuantity: number = this.limit * 2;
  canLoadMore: boolean = true;

  constructor(
    private elRef: ElementRef,
    bookServ: BookService,
    categoryServ: CategoryService,
    authorServ: AuthorService
  ) {
    this.categoryService = categoryServ;
    this.authorService = authorServ;
    this.bookService = bookServ;
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
    this.loadAuthors();
  }

getCategory(id?: string): Category{
  if(!id) {
    console.log("no id");
    return new Category();
  }
  let category: Category | undefined = this.ListCategories.find((el: Category)=> el._id === id);
  if(!category) {
    console.log("no se encontro categoria", category, id)
    return new Category();
  };
  return category;
}

  loadData() {
    this.bookService.getAll(this.page, this.limit).subscribe((data: any) => {
      console.log(data)
      if (data.data) {
        this.ListBooks = this.ListBooks.concat(data.data);
      }

      if (data.paginator) this.cuantity = data.paginator.cuantity;
      this.canLoadMore = this.cuantity > (this.limit * this.page);
      this.page += 1;
    }, (err: any) => {
      console.warn("Fallo loadData", err)
    })
  }

  loadAuthors(){
    this.authorService.getAll(1, 100).subscribe((data: any)=>{
      console.log(data)
      if(data.data){
        this.ListAuthors = this.ListAuthors.concat(data.data);
      }
    }, (err: any)=>{
      console.warn("fallo loadAuthors", err);
    })
  }

  loadCategories(){
    this.categoryService.getAll(1, 100).subscribe((data: any)=>{
      console.log(data)
      if(data.data){
        this.ListCategories = this.ListCategories.concat(data.data);
      }
    }, (err: any)=>{
      console.warn("fallo loadCategories", err);
    })
  }

  onSubmit(event: any){
    event.preventDefault();
    console.log(event.target.name);
    let referenceBook: Book;

    if(event.target.name === "create") referenceBook = this.BookCreate;
    else referenceBook = this.BookUpdate; 

    referenceBook.poster = event.target.poster.files[0];
    referenceBook.document = event.target.document.files[0];

    // let message: string | null = this.validData(referenceBook);
    // if(message !== null) return alert(message);

    let formData: FormData = new FormData(event.target);
    console.log(formData);

    if(event.target.name === "create") this.create(formData);
    else {
      formData.set("_id", referenceBook._id || "");
      this.update(formData);
    }
    event.target.reset();
  }

  validData(book: Book): string | null{
    if(!book) return "el libro es requerido";
    if(!book.title) return "Debe incluir el titulo";
    // demas validaciones
    return null;
  }

  create(formData: FormData): void {
    this.bookService.create(formData).subscribe((data: any) => {
      if (data.data) this.ListBooks.push(data.data);
      this.resetCreate();

    }, (err: any) => {
      console.log("fallo creacion", err);
    })
  }

  update(formData: FormData): void {
    let id: string | undefined = formData.get("_id") as string;
    if (!id) return;

    let objectinList = this.ListBooks.find(el => el._id === id);
    if(!objectinList) return console.log("no encontre el id:", id, objectinList);

    this.bookService.update(id, formData).subscribe((data: any) => {
      if (data.data) {
        let bookUpdated: Book = data.data as Book;
        let indexBook: number = this.ListBooks.findIndex((book: Book) => book._id === id);
        if (indexBook === -1) return console.log("no se ncontro en update", id);

        this.ListBooks[indexBook] = bookUpdated;
        this.resetUpdate();
      }
    }, (err: any) => {
      console.warn("fallo update", err)
    })
  }

  delete(): void {
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
    })
  }

  loadUpdate(id?: string): void {
    if (!id) return;

    let Book: Book | undefined = this.ListBooks.find((book: Book) => book._id === id);
    if (!Book) return;

    this.BookUpdate = Object.assign({}, Book);
  }

  resetCreate() {
    this.BookCreate = new Book();
  }
  resetUpdate() {
    this.BookUpdate = new Book();
  }

}
