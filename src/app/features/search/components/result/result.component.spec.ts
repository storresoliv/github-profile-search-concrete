import { async, ComponentFixture, TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, ActivatedRoute, convertToParamMap } from '@angular/router';

import { ResultComponent } from './result.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { UserInfoComponent } from '../user-info/user-info.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UserRepoItemComponent } from '../user-repo-item/user-repo-item.component';
import { By } from '@angular/platform-browser';
import { UserI } from '../../models/user.model';

const routes: Routes = [
  { path: 'search/:userLogin', component: ResultComponent }
];

const USER_FAKE: UserI = {
  login: 'user_login',
  name: 'user_name',
  location: 'user_location',
  followers: 10,
  organization: '',
  repositories_count: 0,
  star_count: 0,
  avatar_url: 'url'
};

const ORGANIZATION_FAKE = {
  name: 'organization_name'
};

const REPOSITORIES_FAKE = [{
  name: 'repo_name',
  description: 'repo_desc',
  stargazers_count: 98
},
{
  name: 'repo_name2',
  description: 'repo_desc2',
  stargazers_count: 1
}];

const USER_NOT_FOUND = {
  message: 'Not Found',
  documentation_url: 'https://developer.github.com/v3/users/#get-a-single-user'
};

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

  it(`Deberia lanzar la funcion reload al presionar el boton 'search'`, async(() => {
    spyOn(component, 'reload');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.reload).toHaveBeenCalled();
    });
  }));

  it(`Deberia lanzar la funcion search al presionar el boton 'search'`, async(() => {
    spyOn(component, 'search');

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.search).toHaveBeenCalled();
    });
  }));

  it(`Deberia cambiar el valor de la variable 'inputSearch' al escribir un nuevo usuario y presionar el boton 'search'`, async(() => {
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.query(By.css('input'));
      const el = input.nativeElement;

      expect(el.value).toBe('TEST');

      el.value = 'someValue';
      el.dispatchEvent(new Event('input'));

      expect(fixture.componentInstance.inputSearch).toBe('someValue');
    });
  }));

  it(`Deberia lanzar 3 peticiones al escribir un nuevo usuario y presionar el boton 'search'`,
    async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      fixture.whenStable().then(() => {
        const input = fixture.debugElement.query(By.css('input'));
        const el = input.nativeElement;

        el.value = 'someValue';
        el.dispatchEvent(new Event('input'));

        component.search();

        backend.expectOne('https://api.github.com/users/someValue');
        backend.expectOne('https://api.github.com/users/someValue/repos?sort=stars&order=desc');
        backend.expectOne('https://api.github.com/users/someValue/orgs');
      });
  })));

  it(`Deberia mostrar la informacion del usuario al ingresar un usuario existente`,
    fakeAsync(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      const req = backend.expectOne('https://api.github.com/users/TEST');
      const req2 = backend.expectOne('https://api.github.com/users/TEST/repos?sort=stars&order=desc');
      const req3 = backend.expectOne('https://api.github.com/users/TEST/orgs');

      req.flush(USER_FAKE);
      req2.flush(REPOSITORIES_FAKE);
      req3.flush(ORGANIZATION_FAKE);

      tick();

      expect(component.user.name).toBe('user_name');
      expect(component.user.repositories_count).toBe(2);
      expect(component.user.star_count).toBe(99);
  })));

  it(`Deberia mostrar 'User not found' al ingresar un usuario NO existente`,
    fakeAsync(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {

      const req = backend.expectOne('https://api.github.com/users/TEST');
      const req2 = backend.expectOne('https://api.github.com/users/TEST/repos?sort=stars&order=desc');
      const req3 = backend.expectOne('https://api.github.com/users/TEST/orgs');

      req.flush(USER_NOT_FOUND, { status: 404, statusText: 'Not Found' });
      req2.flush(USER_NOT_FOUND, { status: 404, statusText: 'Not Found' });
      req3.flush(USER_NOT_FOUND, { status: 404, statusText: 'Not Found' });

      tick();

      fixture.detectChanges();

      const userNotFoundComponent = fixture.debugElement.nativeElement.querySelector('app-not-found');

      expect(userNotFoundComponent).toBeTruthy();
  })));
});
