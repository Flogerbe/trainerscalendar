import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service'
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

interface LoginModel{
    username: string;
    password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  model: LoginModel = { username: 'onni.pajumaki@live.fi', password: 'password' };
  alertMessage: string;
  showAlert: boolean = false;

  constructor(private app: AppComponent, private api: ApiService, private router: Router) {}

  ngOnInit() {
  }

  onSubmit(){
      this.login();
  }
  
  login(){
    this.api.login(this.model.username,this.model.password).subscribe(result => {
      if (result.success){
        this.app.title = result.nickname;
        localStorage.setItem('TrainingCalendarData', JSON.stringify({ userId: result.userId, nickname: result.nickname, token: result.token }));
        this.router.navigate(['/groups']);
      } else {
        this.showAlert = true;
        this.alertMessage = 'Kirjautuminen epäonnistui';
      }
    });
  }
}
