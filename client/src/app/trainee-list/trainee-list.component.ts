import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-trainee-list',
  templateUrl: './trainee-list.component.html',
  styleUrls: ['./trainee-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AppComponent]
})
export class TraineeListComponent implements OnInit {
  app: AppComponent;

  constructor(private theApp: AppComponent) {
    this.app = theApp;
  }

  ngOnInit() {}

  public getAppInstance(){
    return this.app;
  }

  public getAppTitle(){
    return this.app.title;
  }

}
