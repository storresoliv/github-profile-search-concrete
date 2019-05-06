import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserI } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { RepositoryI } from '../models/repository.model';
import { OrganizationI } from '../models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  /**
   * getUser
   * Obtiene la informacion de un usuario especifico.
   * @param userLogin - User login.
   */
  public getUser(userLogin: string): Observable<UserI> {
    return this.http.get<UserI>(`${environment.google_api}/users/${userLogin}`);
  }

  /**
   * getUserRepositories
   * Obtiene un arreglo de repositorios de un usuario especifico.
   * @param userLogin - User login.
   */
  public getUserRepositories(userLogin: string): Observable<RepositoryI[]> {
    return this.http.get<RepositoryI[]>(`${environment.google_api}/users/${userLogin}/repos?sort=stars&order=desc`);
  }

  /**
   * getOrganizations
   * Obtiene un arreglo de las organizaciones de un usuario especifico.
   * @param userLogin - User login.
   */
  public getOrganizations(userLogin: string): Observable<OrganizationI[]> {
    return this.http.get<OrganizationI[]>(`${environment.google_api}/users/${userLogin}/orgs`);
  }
}
