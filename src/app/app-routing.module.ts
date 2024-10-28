import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookListComponent } from './components/book-list/book-list.component';

const routes: Routes = [
{ path: '', redirectTo: '/books', pathMatch: 'full' }, // Redirect to empty path to default route
{
  path: 'book-list',
  loadChildren: () => import('src/app/components/book-list/book-list.module').then(m => m.BookListModule)
},
{
  path: 'book-form',
  loadChildren: () => import('src/app/components/book-form/book-form.module').then(m => m.BookFormModule)
},
{ path: '', redirectTo: '/book-list', pathMatch: 'full' },
{ path: 'books', component: BookListComponent }, // Define your routes
{ path: 'add-book', component: BookFormComponent }, 
{ path: '**', redirectTo: '/books' },// Wildcard route to catch undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
