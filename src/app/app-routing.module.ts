import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'books',
  loadChildren: () => import('./components/book-list/book-list.module').then(m => m.BookListModule)
},
{
  path: 'add-book',
  loadChildren: () => import('./components/book-form/book-form.module').then(m => m.BookFormModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

