import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  //lasy load
  { path: 'system', loadChildren: './system/system.module#SystemModule'}
];

@NgModule({
  //imports: [RouterModule.forRoot(routes)], - lasy load (preload)
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 