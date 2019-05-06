import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes, ActivatedRoute, Data, Params, convertToParamMap } from '@angular/router';

import { ResultComponent } from './result.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { UserInfoComponent } from '../user-info/user-info.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UserRepoItemComponent } from '../user-repo-item/user-repo-item.component';

const routes: Routes = [
  { path: 'search/:userLogin', component: ResultComponent }
];

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultComponent, UserInfoComponent, NotFoundComponent, UserRepoItemComponent ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [SearchService, {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({userLogin: 'TEST'})
          }
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it(`Deberia enviar 3 peticiones al buscar un usuario`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      backend.expectOne('https://api.github.com/users/TEST');
      backend.expectOne('https://api.github.com/users/TEST/repos?sort=stars&order=desc');
      backend.expectOne('https://api.github.com/users/TEST/orgs');
  })));

  it(`Deberia NO hacer peticiones si NO se ingresa el login de usuario`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      component.inputSearch = '';
      component.search();

      backend.match('https://api.github.com/users');
  })));

});
