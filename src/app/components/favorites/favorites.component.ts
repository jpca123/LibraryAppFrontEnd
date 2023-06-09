import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Book from 'src/app/models/Book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  listBooks: Book[] = [];
  private limit: number = 2;
  private page: number = 1;
  private cuantity: number = this.limit * 2;
  canLoadMore: boolean = true;
  idDelete: string = "";

  private bookService: BookService;
  private http: HttpClient;

  constructor(bookServ: BookService, httpServ: HttpClient) {
    this.bookService = bookServ;
    this.http = httpServ;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.bookService.getFavorites(this.page, this.limit).subscribe((data: any) => {
      console.log(data)
      if (data.ok) {

        // data.data return list of id, add the book of each id in the list
        data.data.forEach((el: any) => {
          this.bookService.get(el.bookId).subscribe((data: any)=>{
            if(data.ok) this.listBooks.push(data.data);
            else console.log('fallo get', data.errors);
          })
          // this.page += 1;

        }, (err: any)=>{
          console.log('fallo get', err);
        }, ()=> console.log(this.listBooks))
      }

      if (data.paginator) this.cuantity = data.paginator.cuantity;
      this.canLoadMore = this.cuantity > (this.limit * this.page - 1);
      if(data.ok) this.page += 1;
    }, (err: any) => {
      console.warn("Fallo loadData", err)
    })
  }

  remove(id: string |  undefined){
    if(!id) return console.warn( {error: "No paso id", message: `id: ${id}`} );

    this.bookService.removeFavorite(id).subscribe((data: any)=>{
      if (data.ok){
        let indexObject: number = this.listBooks.findIndex((el: any) => el._id === id);
        if(indexObject <= -1) return console.warn( {error: "No encontro index", message: `id: ${id}`, indexObject} );
        this.listBooks.splice(indexObject, 1);
      }
    }, (err: any) => {
      console.warn("Fallo remove", id, err);
    })
  }

}
