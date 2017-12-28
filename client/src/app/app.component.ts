import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  public title = '';
  userName = '';
  isCoach = false;
  currentState = { userId: '', groupId: '' };
  alertMessage: string;
  showAlert: boolean = false;

  constructor(private api: ApiService) { }

  public getRole() {
    return this.isCoach ? 'Coach' : 'Swimmer';
  }

  ngOnInit() {
    this.setTitle();
  }

  setTitle() {
    let nickname = this.api.getFromStorage('nickname');
    let groupId = this.api.getFromStorage('groupId');
    if (groupId) {
      this.api.getGroup(groupId).subscribe(result => {
        this.title = nickname + (result.name ? ' / ' + result.name : '');
      });
    }
    this.title = nickname;
  }
}
