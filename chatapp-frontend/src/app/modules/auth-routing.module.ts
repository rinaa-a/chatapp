import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { AuthtabsComponent } from '../components/authtabs/authtabs.component';

const routes: Routes = [
  {
    path: '',
    component: AuthtabsComponent
  }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AuthRoutingModule { }
