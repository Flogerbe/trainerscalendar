import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-trainee-list',
  templateUrl: './trainee-list.component.html',
  styleUrls: ['./trainee-list.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AppComponent]
})
export class TraineeListComponent implements OnInit {
  
  constructor(private app: AppComponent) {}

  ngOnInit() {}

}
