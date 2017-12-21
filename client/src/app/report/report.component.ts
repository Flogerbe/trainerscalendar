import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { TrainigEvent, ReportData } from '../model'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';

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
  filteredEvents: TrainigEvent[];
  reportData: ReportData = new ReportData();
  startDate: Date;
  endDate: Date;
  startDateString: string;
  endDateString: string;
  groupUsers: string[] = ['Koko ryhmä'];
  selectedUser: string = this.groupUsers[0];
  roleName: string;

  constructor(private api: ApiService) { }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('TrainingCalendarData'));
    this.groupId = data.groupId;
    this.roleName = this.api.getFromStorage('groupRoleName');
    if (this.roleName == 'coach') {
      this.api.getGroupsUsers(this.groupId).subscribe(result => {
        let nicknames = result.map(r => r.nickname);
        this.groupUsers = _.concat(this.groupUsers, nicknames);
      });
    }
    this.userId = data.userId;
    this.groupId = data.groupId;

    if (this.userId && this.groupId) {
      if (this.roleName == 'coach') {
        this.api.getGroupReportData(this.groupId)
          .subscribe(result => {
            this.events = result;
            this.filteredEvents = this.events;
            this.calculateReportData();
          });
      } else {
        this.api.getUserReportData(this.groupId, this.userId)
          .subscribe(result => {
            this.events = result;
            this.filteredEvents = this.events;
            this.calculateReportData();
          });
      }
    }
  }

  filter() {
    this.filteredEvents = _.filter(this.events, o => { return this.startDate == undefined ? true : (new Date(o.date_time) >= this.startDate) });
    this.filteredEvents = _.filter(this.filteredEvents, o => { return this.endDate == undefined ? true : (new Date(o.date_time) <= this.endDate) });
    this.filteredEvents = _.filter(this.filteredEvents, o => { return (this.selectedUser == 'Koko ryhmä' ? true : o.nickname.toLowerCase() == this.selectedUser.toLowerCase()) });
    this.calculateReportData();
  }

  setStartDate(date: Date) {
    this.startDateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  setEndDate(date: Date) {
    this.endDateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    this.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  }

  onStartDateChange(date: NgbDateStruct) {
    this.setStartDate(new Date(date.year, date.month - 1, date.day));
    this.filter();
  }

  onEndDateChange(date: NgbDateStruct) {
    this.setEndDate(new Date(date.year, date.month - 1, date.day));
    this.filter();
  }

  onUserChange(user: string) {
    this.selectedUser = user;
    this.filter();
  }

  calculateReportData() {
    this.reportData.stressLevelAverage = _.meanBy(this.filteredEvents, r => r.stress_level)
    this.reportData.nutritionAverage = _.meanBy(this.filteredEvents, (r) => r.nutrition)
    this.reportData.sleepAverage = _.meanBy(this.filteredEvents, (r) => r.sleep)
    this.reportData.count = this.filteredEvents.length;
  }

  convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = args.columnDelimiter || ';';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  formatDate(date: Date): string {
    return moment(date).format('DD.MM.YYYY');
  }

  downloadData() {
    let today: string = moment().format('DD.MM.YYYY');
    let exportEvents = _.map(this.events, (e) => {
      return {
        Pvm: moment(e.date_time).format('DD.MM.YYYY'), Henkilö: e.nickname, 'Uinnin kesto': e.swim_duration, 'Kuivan kesto': e.co_train_duration, Rasitus: e.stress_level,
        Ruoka: e.nutrition, Uni: e.sleep
      }
    })
    let csv = this.convertArrayOfObjectsToCSV({
      data: exportEvents
    });

    let blob = new Blob([csv], {
      type: "{ type: 'text/csv;charset=utf-8;' }"
    });

    FileSaver.saveAs(blob, "export.csv");
  }
}
