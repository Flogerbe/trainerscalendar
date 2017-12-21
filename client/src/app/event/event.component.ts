import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrainigEvent } from '../model';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventComponent implements OnInit {

  event: TrainigEvent;
  dateString: string;
  selectedDate;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.event = new TrainigEvent({ date_time: new Date(), swim_duration: 60, co_train_duration: 30, stress_level: 3, nutrition: 3, sleep: 4 });
    let d = new Date();
    this.dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let eventId = params['id'];

      if (eventId != 'new') {
        this.api.getEvent(eventId)
          .subscribe(result => {
            this.event = result;
            let d = new Date(this.event.date_time);
            this.dateString = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
          });
      }
    })
  }

  onDateChange(date: NgbDateStruct) {
    console.log(date);
    this.dateString = `${date.day}.${date.month}.${date.year}`;
    this.event.date_time = new Date(date.year, date.month - 1, date.day);

  }

  changeAttrValue(attr: string, step: number, min: number, max: number, direction: string) {
    if (direction === '+' && this.event[attr] < max) {
      this.event[attr] += step;
    }
    else if (direction === '-' && this.event[attr] > min) {
      this.event[attr] -= step;
    }
  }

  onSubmit() {
    this.save();
  }

  save() {
    if (this.event.id) {
      this.api.updateEvent(this.event.id, this.event).subscribe(result => {
        this.router.navigate(['/events']);
      });
    } else {
      this.event.group_id = this.api.getFromStorage('groupId');
      this.api.addEvent(this.event.id, this.event).subscribe(result => {
        this.router.navigate(['/events']);
      });
    }
  }
}

