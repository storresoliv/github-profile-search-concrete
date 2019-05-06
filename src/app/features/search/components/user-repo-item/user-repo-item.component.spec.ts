import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRepoItemComponent } from './user-repo-item.component';

describe('UserRepoItemComponent', () => {
  let component: UserRepoItemComponent;
  let fixture: ComponentFixture<UserRepoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRepoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRepoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
