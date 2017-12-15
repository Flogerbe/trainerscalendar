import { Injectable } from '@angular/core';
import { environment} from '../environments/environment'
import { HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TrainingGroupsResponse, TrainingGroup, TrainingEventsResponse, TrainigEvent, LoginResponse, User, UserResponse, TrainingGroupResponse, CommonResponse } from './model';

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

  public register(username: string, password: string, nickName: string): Observable<LoginResponse> {
    return this.http
      .post(API_URL + '/register', { username: username, password: password, nickname: nickName })
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

  public addEvent(groupId: string, event: TrainigEvent): Observable<string> {
    return this.http
      .post<CommonResponse>(API_URL + '/events/' + groupId , event, this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public updateEvent(eventId: string, event: TrainigEvent): Observable<string> {
    return this.http
      .put<CommonResponse>(API_URL + '/events/' + eventId , event, this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public deleteEvent(eventId: string): Observable<string> {
    return this.http
      .delete<CommonResponse>(API_URL + '/events/' + eventId , this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public addGroup(group: TrainingGroup): Observable<string> {
    return this.http
      .post<CommonResponse>(API_URL + '/groups', group, this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public updateGroup(groupId: string, group: TrainingGroup): Observable<string> {
    return this.http
      .put<CommonResponse>(API_URL + '/groups/' + groupId , event, this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public deleteGroup(groupId: string): Observable<string> {
    return this.http
      .delete<CommonResponse>(API_URL + '/groups/' + groupId , this.getToken())
      .map(response => {
        return response.message;
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

  public joinGroup(groupId: string, userId: string): Observable<TrainingGroupsResponse> {
    return this.http
      .post<TrainingGroupsResponse>(API_URL + '/joinGroup', { groupId: groupId }, this.getToken())
      .map(response => {
        return  response.message;
      })
      .catch(this.handleError);
  }

  public unJoinGroup(groupId: string, userId: string): Observable<TrainingGroupsResponse> {
    return this.http
      .post<TrainingGroupsResponse>(API_URL + '/unJoinGroup', { groupId: groupId }, this.getToken())
      .map(response => {
        return  response.message;
      })
      .catch(this.handleError);
  }

  public getAllGroups(): Observable<TrainingGroup[]> {
    return this.http
      .get<TrainingGroupsResponse>(API_URL + '/groups', this.getToken())
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

  public getGroupReportData(groupId: string): Observable<any> {
    return this.http
      .get<CommonResponse>(API_URL + '/groupEvents/' + groupId, this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public getUserReportData(groupId: string, userId: string): Observable<any> {
    return this.http
      .get<CommonResponse>(API_URL + '/userEvents/' + groupId + '/' + userId, this.getToken())
      .map(response => {
        return response.message;
      })
      .catch(this.handleError);
  }

  public handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
