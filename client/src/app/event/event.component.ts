import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TrainigEvent } from '../model';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventComponent implements OnInit {

  event: TrainigEvent;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { 
    this.event = new TrainigEvent({});
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

