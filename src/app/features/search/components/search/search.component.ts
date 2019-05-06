import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  public inputSearch: string;

  ngOnInit() {
    this.inputSearch = '';
  }

  gotoResult() {
    if (this.inputSearch !== '') {
      this.router.navigate(['/search', this.inputSearch]);
    }
  }

}
