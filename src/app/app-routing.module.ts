import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathSearchComponent } from './path-search/path-search.component';
import { StoreLocationComponent } from './store-location/store-location.component';


const routes: Routes = [
  { path: 'pathsearch/:locationId/:positionId', component: PathSearchComponent, pathMatch: 'prefix' },
  { path: 'storelocation', component: StoreLocationComponent, pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
