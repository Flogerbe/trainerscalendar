import { Injectable } from '@angular/core';
import { environment} from '../environments/environment'
import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TrainingGroupsResponse, TrainingGroup, TrainingEventsResponse, TrainigEvent, LoginResponse, User, UserResponse, TrainingGroupResponse } from './model';

const API_URL = environment.apiUrl;

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }
  
  public getFromStorage(id){
    return JSON.parse(localStorage.getItem('TrainingCalendarData'))[id];
  }

  public setToStorage(id: string, value: string){
    let data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    data[id] = value;
    localStorage.setItem('TrainingCalendarData', JSON.stringify(data));
  }

  private getToken(): object {
    return {
      headers: new HttpHeaders().set('token', JSON.parse(localStorage.getItem('TrainingCalendarData')).token)
    }
  }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post(API_URL + '/login', { username: username, password: password })
      .map(response => {
        return response;
      })
      .catch(this.handleError);
  }

  public getUser(email: string): Observable<User[]> {
    return this.http
      .get<UserResponse>(API_URL + '/users/' + email, this.getToken())
      .map(response => {
        return new User(response.message);
      })
      .catch(this.handleError);
  }

  public getEvents(groupId: string, userId: string): Observable<TrainigEvent[]> {
    return this.http
      .get<TrainingEventsResponse>(API_URL + '/userEvents/' + groupId + '/' + userId, this.getToken())
      .map(response => {
        let events = response.message;
        return events.map((event) => new TrainigEvent(event));
      })
      .catch(this.handleError);
  }

  public getEvent(id: string): Observable<TrainigEvent> {
    return this.http
      .get<TrainingEventsResponse>(API_URL + '/events/' + id , this.getToken())
      .map(response => {
        return new TrainigEvent(response.message);
      })
      .catch(this.handleError);
  }

  public getGroups(userId: string): Observable<TrainingGroup[]> {
    return this.http
      .get<TrainingGroupsResponse>(API_URL + '/usersGroups/' + userId, this.getToken())
      .map(response => {
        let groups = response.message;
        return groups.map((group) => new TrainingGroup(group));
      })
      .catch(this.handleError);
  }

  public getGroup(groupId: string): Observable<TrainingGroup> {
    return this.http
      .get<TrainingGroupResponse>(API_URL + '/groups/' + groupId, this.getToken())
      .map(response => {
        return new TrainingGroup(response.message[0]);
      })
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error(error);
    return Observable.throw(error);  
  }
}
