import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrainigEvent } from '../model';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventComponent implements OnInit {

  event: TrainigEvent;

  constructor(private api: ApiService, private route: ActivatedRoute) { 
    this.event = new TrainigEvent({});
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let eventId = params['id'];
      this.api.getEvent(eventId)
        .subscribe(result => {
          this.event = result;
        });
    })
  }
}

