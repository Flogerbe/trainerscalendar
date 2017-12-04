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
  label: string;

  constructor(private app: AppComponent, private api: ApiService) { }

  ngOnInit() {
    this.setLabel();
  }

  setLabel() {
    let groupId = this.api.getFromStorage('groupId');
    this.api.getGroup(groupId).subscribe(result => {
      let label = this.api.getFromStorage('nickname');
      this.label = label + result.name ? ' / ' + result.name : '';
    });
  }
}
