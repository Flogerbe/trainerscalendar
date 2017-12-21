import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AppComponent } from '../app.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {

  constructor(private app: AppComponent, private api: ApiService) { }

  ngOnInit() { }
}
