import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PathSearchComponent } from './path-search/path-search.component';
import { QrCodeGeneratorComponent } from './qr-code-generator/qr-code-generator.component';
import { StoreLocationComponent } from './store-location/store-location.component';


const routes: Routes = [
  { path: 'pathsearch/:locationId/:positionId', component: PathSearchComponent, pathMatch: 'prefix' },
  { path: 'storelocation', component: StoreLocationComponent, pathMatch: 'prefix' },
  { path: 'generateQrCode', component: QrCodeGeneratorComponent, pathMatch: 'prefix' },
  { path: 'adminDashboard', component: AdminDashboardComponent, pathMatch: 'prefix' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
