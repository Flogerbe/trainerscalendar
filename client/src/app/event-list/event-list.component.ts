import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service'
import { TrainigEvent } from '../model'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EventListComponent implements OnInit {

  events: TrainigEvent[];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    let userId = data.userId;
    let groupId = data.groupId;

    if (userId && groupId) {
      this.api.getEvents(groupId, userId)
        .subscribe(result => {
          this.events = result;
        });
    }
  }
}

