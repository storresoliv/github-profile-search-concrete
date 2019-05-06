import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResultComponent } from './components/result/result.component';
import { SearchComponent } from './components/search/search.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserRepoItemComponent } from './components/user-repo-item/user-repo-item.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ResultComponent,
    SearchComponent,
    UserInfoComponent,
    UserRepoItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    NotFoundComponent,
    ResultComponent,
    SearchComponent
  ],
  providers: []
})
export class SearchModule { }
