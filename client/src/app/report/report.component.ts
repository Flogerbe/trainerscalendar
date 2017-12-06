import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { TrainigEvent } from '../model'
import * as _ from 'lodash';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {
  userId: string;
  groupId: string;
  events: TrainigEvent[];
  average: number = 0;

  constructor(private api: ApiService) { }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    this.userId = data.userId;
    this.groupId = data.groupId;

    if (this.userId && this.groupId) {
      this.api.getReportData(this.groupId)
        .subscribe(result => {
          this.events = result;
          this.getReportData();
        });
    }
  }

  getReportData(){
    this.average = _.meanBy(this.events, (r) => r.stress_level)
  }
}
