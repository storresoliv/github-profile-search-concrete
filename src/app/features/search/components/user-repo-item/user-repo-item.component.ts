import { Component, OnInit, Input } from '@angular/core';
import { RepositoryI } from '../../models/repository.model';

@Component({
  selector: 'app-user-repo-item',
  templateUrl: './user-repo-item.component.html',
  styleUrls: ['./user-repo-item.component.css']
})
export class UserRepoItemComponent implements OnInit {

  @Input() repository: RepositoryI;

  constructor() { }

  ngOnInit() {
  }

}
