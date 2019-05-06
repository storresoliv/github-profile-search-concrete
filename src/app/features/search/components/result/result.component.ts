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
  public user: UserI; /** Variable que contiene toda la informacion del usuario. */
  public repositories: RepositoryI[]; /** Variable que contiene los repositorios del usuario. */

  ngOnInit() {
    /** Valores por defecto */
    this.isUserNotFound = false;
    this.inputSearch = '';
    this.user = undefined;
    this.repositories = [];

    /** Obtiene el parametro :userLogin */
    this.inputSearch = this.route.snapshot.paramMap.get('userLogin');

    /** Realiza la busqueda. */
    if (this.inputSearch && this.inputSearch !== '') { this.search(); }
  }

  /**
   * Search
   * Busca el usuario ingresado.
   */
  search() {
    if (this.inputSearch !== '') {
      /** Promise all lanza peticiones en paralelo. */
      Promise.all([
        this.service.getUser(this.inputSearch).toPromise(),
        this.service.getUserRepositories(this.inputSearch).toPromise(),
        this.service.getOrganizations(this.inputSearch).toPromise()
      ]).then(values => {
        this.isUserNotFound = false; // al encontrar el usuario, la variable se asigna como false.
        /** Asigna el usuario, los repositorios y las organizaciones para values[0], values[1], values[2] respectivamente */
        this.user = values[0];
        this.repositories = values[1];
        this.user.repositories_count = values[1].length; // cantidad de repositorios
        if (values[1].length > 0) {
          /** Realiza un conteo por cada uno de los repositorios y va creando una sumatoria */
          this.user.star_count = values[1].map((repo) => repo.stargazers_count).reduce((last, current) => last + current);
        } else {
          this.user.star_count = 0;
        }
        /** Valida que tenga al menos una organizacion */
        if (values[2].length > 0) {
          this.user.organization = values[2][0].login;
        } else {
          this.user.organization = '';
        }
      }).catch(() => {
        this.isUserNotFound = true;
        this.user = undefined;
      });
    }
  }

  /**
   * Reload
   * recarga el componente con la nueva busqueda.
   */
  reload() {
    if (this.inputSearch !== '') {
      this.router.navigate(['/search', this.inputSearch]);
      this.search();
    }
  }
}
