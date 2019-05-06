import { Component, OnInit } from '@angular/core';
import { UserI } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { RepositoryI } from '../../models/repository.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: SearchService, private router: Router) { }

  public inputSearch: string; /** Variable que almacena el texto a buscar. */
  public isUserNotFound: boolean; /** Variable que retorna TRUE si es usuario NO ha sido encontrado, de lo contrario FALSE. */
  public user: UserI;
  public repositories: RepositoryI[];

  ngOnInit() {
    /** Valores por defecto */
    this.isUserNotFound = false;
    this.inputSearch = '';
    this.user = undefined;
    this.repositories = [];
    this.route.paramMap.subscribe(params => {
      this.inputSearch = params.get('userLogin');
      this.search();
    });
  }

  /**
   * Search
   * Busca el usuario ingresado.
   */
  search() {
    if (this.inputSearch !== '') {
      Promise.all([
        this.service.getUser(this.inputSearch).toPromise(),
        this.service.getUserRepositories(this.inputSearch).toPromise()
      ]).then(values => {
        this.isUserNotFound = false;
        this.user = values[0];
        this.repositories = values[1];
        this.user.repositories_count = values[1].length;
        if (values[1].length > 0) {
          this.user.star_count = values[1].map((repo) => repo.stargazers_count).reduce((last, current) => last + current);
        } else {
          this.user.star_count = 0;
        }
      }).catch((e) => {
        this.isUserNotFound = true;
        this.user = undefined;
      });
    }
  }

  reload() {
    if (this.inputSearch !== '') {
      this.router.navigate(['/search', this.inputSearch]);
    }
  }
}
