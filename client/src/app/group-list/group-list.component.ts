import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service'
import { TrainingGroup,  } from '../model';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupListComponent implements OnInit {

  groups: TrainingGroup[];

  constructor(private app: AppComponent, private api: ApiService, private router: Router) { }

  ngOnInit() {
    let userId = JSON.parse(localStorage.getItem('TrainingCalendarData')).userId;
    this.api.getGroups(userId)
      .subscribe(result => {
        this.groups = result;
      });
  }

  goToEvents(id: string){
    this.app.currentState.groupId = id;
    this.api.getGroup(id).subscribe(result => {
      this.app.title = this.api.getFromStorage('nickname') + ' / ' + result.name;
      this.api.setToStorage('groupId', id);
      this.router.navigate(['/events']);
    })
  }
}

