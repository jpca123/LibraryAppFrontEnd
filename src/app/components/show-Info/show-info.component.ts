import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShowInfoTypes } from 'src/app/models/types';


@Component({
  // standalone: true,
  selector: 'app-show-info',
  templateUrl: './show-info.component.html',
  styleUrls: ['./show-info.component.css']
})
export class ShowInfoComponent implements OnInit, OnDestroy {

  Visible = false;
  @Input() InfoEmitter: any;
  Info: string[] = [];
  classTypeInfo = ShowInfoTypes.WARNING;

  listener$?: Subscription; 

  constructor() { }

  ngOnInit(): void {
    this.listener$ = this.InfoEmitter.subscribe((data: any) => this.show(data.type, data.data) , console.warn)
  }

  show<T>(type: ShowInfoTypes, info: any){
    if(info instanceof Array){
      return this.showInfo(type, info as string[]);
    }else{
      let infoParsed: string[] = info.error.errors.map(
        (el: {error: string, message: string}) => `${el.error||"Error"}: ${el.message || "Unknow Error"}`);
      return this.showInfo(type, infoParsed)
    }
  }

  showInfo(type: ShowInfoTypes, info: string[]){
    if(info.length < 1) return this.cleanInfo();
    this.classTypeInfo = type;
    this.Info = info;
    this.Visible = true;
    console.log({type: this.classTypeInfo})
  }

  cleanInfo(){
    this.Visible = false;
    this.Info = []
  }

  ngOnDestroy(): void {
    if(this.listener$) this.listener$.unsubscribe();
  }
}
