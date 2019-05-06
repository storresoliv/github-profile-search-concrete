import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor() { }

  public inputSearch: string; /** Variable que almacena el texto a buscar. */
  public isUserNotFound: boolean; /** Variable que retorna TRUE si es usuario NO ha sido encontrado, de lo contrario FALSE. */

  ngOnInit() {
    /** Valores por defecto */
    this.isUserNotFound = false;
    this.inputSearch = '';
  }

  /**
   * Search
   * Busca el usuario ingresado.
   */
  search() {
    if (this.inputSearch !== '') {
      console.log('buscando...');
    }
  }
}
