import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service'
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

class LoginModel{
    username: string;
    password: string;
    nickname: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  model: LoginModel;
  alertMessage: string;
  showAlert: boolean = false;

  constructor(private app: AppComponent, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.model = new LoginModel();
  }
  
  login(){
    this.api.login(this.model.username,this.model.password).subscribe(result => {
      if (result.success){
        localStorage.setItem('TrainingCalendarData', JSON.stringify({ userId: result.userId, nickname: result.nickname, token: result.token }));
        this.app.setTitle();
        this.router.navigate(['/groups']);
      } else {
        this.showAlert = true;
        this.alertMessage = 'Kirjautuminen epäonnistui';
      }
    });
  }

  register(){
    this.api.register(this.model.username,this.model.password, this.model.nickname).subscribe(result => {
      if (result.success){
        localStorage.setItem('TrainingCalendarData', JSON.stringify({ userId: result.userId, nickname: result.nickname, token: result.token }));
        this.app.setTitle();
        this.router.navigate(['/groups']);
      } else {
        this.showAlert = true;
        this.alertMessage = 'Kirjautuminen epäonnistui';
      }
    });
  }

  logout(){
    this.api.setToStorage('token', '');
  }

  isLoggedIn() {
    return this.api.getFromStorage('token') != '';
  }
}
