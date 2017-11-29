import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface LoginResponse {
  success: boolean;
  token: string;
}

interface Response {
  success: boolean;
  message: object;
}

interface Event {
  id: string;
  user_id: string;
  group_id: string;
  date_time: Date;
}

const body = { username: 'onni.pajumaki@live.fi', password: 'password' };

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EventListComponent implements OnInit {

  token: string;
  events: object;
  constructor(private http: HttpClient) { 
  }

  ngOnInit() {
    this.http.post<LoginResponse>('http://localhost:9080/api/login', body)
      .subscribe(result => {
        this.token = result.token;
        this.http.get<Response>('http://localhost:9080/api/userEvents/331f3a31a-fbbe-493d-ba26-acc1cedeff63/4f569604-4c57-47b5-81b4-ff2281b26ef3',
          {
            headers: new HttpHeaders().set('token', this.token),
          })
          .subscribe(result => {
            this.events = result.message;
          });
      })
  }
}
