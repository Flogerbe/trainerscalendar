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
  dateString: string = '1.1.2011';
  selectedDate;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { 
    this.event = new TrainigEvent({});
    this.event.date_time = new Date();
    this.event.swim_duration = 60;
    this.event.swim_stress_level = 3;
    this.dateString = this.event.date_time.getDate() + '.' + (this.event.date_time.getMonth() + 1) + '.' + this.event.date_time.getFullYear();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let eventId = params['id'];

      if (eventId != 'new'){
        this.api.getEvent(eventId)
          .subscribe(result => {
            this.event = result;
          });
      }
    })
  }

  onDateChange(date: NgbDateStruct) {
    console.log(date);
    this.dateString = `${date.day}.${date.month}.${date.year}`;
    this.event.date_time = new Date(date.year, date.month-1, date.day);
  
  }

  changeSwimDuration(direction){
    const step = 15;
    const min = 1;
    const max = 300;

    if (direction === '+' && this.event.swim_stress_level < max) {
      this.event.swim_duration += step;
    }
    else if (direction === '-' && this.event.swim_stress_level > min) {
      this.event.swim_duration -= step;
    }
  }

  changeSwimStressLevel(direction){
    const step = 1;
    const min = 1;
    const max = 5;

    if (direction === '+' && this.event.swim_stress_level < max) {
      this.event.swim_stress_level += step;
    }
    else if (direction === '-' && this.event.swim_stress_level > min) {
      this.event.swim_stress_level -= step;
    }
  }

  onSubmit(){
    this.save();
  }

  save(){
    if (this.event.id){
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

