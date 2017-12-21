import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingGroup } from '../model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupComponent implements OnInit {
  group: TrainingGroup;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.group = new TrainingGroup({});
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let groupId = params['id'];

      if (groupId != 'new') {
        this.api.getGroup(groupId)
          .subscribe(result => {
            this.group = result;
          });
      }
    })
  }

  onSubmit(){
    this.save();
  }

  save() {
    if (this.group.id) {
      this.api.updateGroup(this.group.id, this.group).subscribe(result => {
        this.router.navigate(['/groups']);
      });
    } else {
      this.api.addGroup(this.group).subscribe(result => {
        this.router.navigate(['/groups']);
      });
    }
  }
}
