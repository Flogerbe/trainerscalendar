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
  userId: string;
  groupId: string;
  weekdays: string[] = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];


  constructor(private api: ApiService) {
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    this.userId = data.userId;
    this.groupId = data.groupId;

    if (this.userId && this.groupId) {
      this.api.getEvents(this.groupId, this.userId)
        .subscribe(result => {
          this.events = result;
        });
    }
  }

  deleteEvent(id: string){
    this.api.deleteEvent(id)
    .subscribe(result => {
      this.api.getEvents(this.groupId, this.userId)
        .subscribe(result => {
          this.events = result;
        });
    });
  }

  getDateStr(date: string) {
    let d: Date = new Date(date);
    return d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
  }

  getDayOfWeek(date: string) {
    return this.weekdays[new Date(date).getDay()];
  }
}

