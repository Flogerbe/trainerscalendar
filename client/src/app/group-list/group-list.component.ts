import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service'
import { TrainingGroup,  } from '../model';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import * as _ from 'lodash';
import { TrackByFunction } from '@angular/core/src/change_detection/differs/iterable_differs';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupListComponent implements OnInit {

  groups: TrainingGroup[];
  allGroups: TrainingGroup[];

  constructor(private app: AppComponent, private api: ApiService, private router: Router) { }

  ngOnInit() {
    let userId = JSON.parse(localStorage.getItem('TrainingCalendarData')).userId;
    this.initGroups(userId);
  }

  initGroups(userId) {
    this.api.getGroups(userId)
    .subscribe(result => {
      this.groups = result;
    });
  this.api.getAllGroups()
    .subscribe(result => {
      this.allGroups = result;
    });
  }

  getGroupsNotJoinedIn() {
    return _.differenceBy(this.allGroups, this.groups, 'id');
  }

  joinGroup(groupId: string) {
    const data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    let userId = data.userId;

    this.api.joinGroup(groupId, userId).subscribe(result => {
      this.initGroups(userId);
    })
  }

  unJoinGroup(groupId: string) {
    const data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    let userId = data.userId;

    this.api.unJoinGroup(groupId, userId).subscribe(result => {
      this.initGroups(userId);
    })
  }

  goToEvents(id: string){
    let roleName = _.find(this.groups, { 'id': id }).rolename;
    this.api.setToStorage('groupRoleName', roleName);
    this.api.setToStorage('groupId', id);
    this.app.setTitle();

    if (roleName == 'coach'){ 
      this.router.navigate(['/reports']);
    } else {
      this.api.getGroup(id).subscribe(result => {
        this.api.setToStorage('groupId', id);
        this.router.navigate(['/events']);
      })
    }
  }
}

