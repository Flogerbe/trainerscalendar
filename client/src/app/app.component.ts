import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'appi';
  isCoach = false;

  public getRole() {
    return this.isCoach ? 'Coach' : 'Trainee';
  }
}
