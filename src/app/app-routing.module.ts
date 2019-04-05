import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  //lasy load
  { path: 'system', loadChildren: './system/system.module#SystemModule'},
  //{ path: '**', component: NotFoundComponent }
];

@NgModule({
  //imports: [RouterModule.forRoot(routes)], 
  imports: [RouterModule.forRoot(routes, { //- lasy load (preload)
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 