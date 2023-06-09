import { Component, ElementRef, OnInit } from '@angular/core';
import Author from 'src/app/models/Author';
import Category from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private categoryService: CategoryService;
  ListCategories: Category[] = [];
  ErrorsCreate: string[] = [];
  ErrorsUpdate: string[] = [];
  ErrorsUser: string[] = [];
  
  private page: number = 1; 
  private limit: number = 5; 
  private cuantity: number = this.limit * 2; 
  canLoadMore: boolean = this.cuantity > (this.limit * this.page);

  CategoryCreate: Category = new Category();
  CategoryUpdate: Category = new Category();

  constructor(private elRef: ElementRef, categoryServ: CategoryService) {
    this.categoryService = categoryServ;
  }
  
  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.categoryService.getAll(this.page, this.limit).subscribe((data: any)=> {
      this.ListCategories = this.ListCategories.concat(data.data);

      if(data.paginator) this.cuantity = data.paginator.cuantity || 5;
      console.log(data)
      this.canLoadMore = this.cuantity > (this.limit * (this.page - 1) );
      if(data.ok) this.page += 1;

    }, (err: any)=>{
      console.warn("fallo la carga de categorias", err)
    })
  }

  manageSubmit(event: any){
    event.preventDefault();

    // validacion datos
    console.log(event)
    let category: string = event.target.category.value;
    if(category.match(/d/g)) {
      event.target.reset();
      return alert("la categoria no debe tener numeros")
    };
  }


  create(): void {
      this.categoryService.create(this.CategoryCreate).subscribe((data: any)=>{
        let objectCreate: Category = data.data as Category;
        this.ListCategories.push(objectCreate);
        this.CategoryCreate = new Category();
      }, (err: any)=>{
        console.warn("fallo creacion", err);
      });
  }

  update(): void {
      let id: string | undefined = this.CategoryUpdate._id;
      if(!id) return alert("no se paso id dicion");

      let objectInList: Category | undefined = this.ListCategories.find((book: Category) => book._id === id);
      if(!objectInList) return alert("no se encontro object");

      
      this.categoryService.update(id, this.CategoryUpdate).subscribe((data: any)=>{
        let objectUpdated: Category = data.data as Category;
        let indexObject: number = this.ListCategories.indexOf(objectInList!);
        this.ListCategories[indexObject] = objectUpdated;

        this.CategoryUpdate = new Category();
      }, (err: any)=>{
        console.warn("fallo edicion", err);
      })

    }

  delete (): void {
      let id: string | undefined = this.CategoryUpdate._id;
      if(!id) return;

      let indeObject: number = this.ListCategories.findIndex((book: Category) => book._id === id);
      if(indeObject === -1) return;

      this.categoryService.delete(id).subscribe((data: any)=>{
        if(data.data && data.data.ok){
          this.ListCategories.splice(indeObject, 1);
          this.CategoryUpdate = new Category();
        }
        else alert("Fallo la eliminacion");
      }, (err: any)=>{
        console.warn("fallo Eliminacion", err);
        this.ErrorsUser = err.error.errors.map((el: any) => el.message);
      })

  }

  getCategory(id: string): boolean | Category{
    let category: Category | undefined = this.ListCategories.find((el: Category)=> el._id === id);
    if(!category) return false;
    return category
  }

  getAuthor(id: string): boolean | Author{
    let author: Author | undefined = this.ListCategories.find((el: Author)=> el._id === id);
    if(!author) return false;
    return author
  }

  loadUpdate(id?: string): void {
    if (!id) return;

    let object: Category | undefined = this.ListCategories.find((category: Category) => category._id === id);
    if (!object) return;

    this.CategoryUpdate = Object.assign({}, object);
  }

  resetCreate(){
    this.CategoryCreate = new Category();
  }
  
  cleanErrors(){
    this.ErrorsCreate = [];
    this.ErrorsUpdate = [];
    this.ErrorsUser = [];
  }
}