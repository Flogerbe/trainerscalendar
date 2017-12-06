import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = '';
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
    let groupId = this.api.getFromStorage('groupId');
    this.api.getGroup(groupId).subscribe(result => {
      this.title = this.api.getFromStorage('nickname') + ' / ' + result.name;
      this.userName = this.api.getFromStorage('nickname');
    });
  }
}
