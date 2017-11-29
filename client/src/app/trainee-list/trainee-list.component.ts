import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-trainee-list',
  templateUrl: './trainee-list.component.html',
  styleUrls: ['./trainee-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TraineeListComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {}

  public getAppInstance(){
  }

  public getAppTitle(){
  }

}
