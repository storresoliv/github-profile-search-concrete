import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './features/search/components/search/search.component';
import { ResultComponent } from './features/search/components/result/result.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'search/:userLogin', component: ResultComponent },
  { path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
