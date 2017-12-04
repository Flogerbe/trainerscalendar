import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service'
import { AppComponent } from '../app.component';

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

  constructor(private app: AppComponent, private api: ApiService) {}

  ngOnInit() {
  }

  onSubmit(){
      this.login();
  }
  
  login(){
    this.api.login(this.model.username,this.model.password).subscribe(result => {
      this.app.title = result.nickname;
      localStorage.setItem('TrainingCalendarData', JSON.stringify({ userId: result.userId, nickname: result.nickname, token: result.token }));
    });
  }
}
