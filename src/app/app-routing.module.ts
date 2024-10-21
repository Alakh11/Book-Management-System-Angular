import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookListComponent } from './components/book-list/book-list.component';

const routes: Routes = [
{ path: '', redirectTo: '/books', pathMatch: 'full' }, // Redirect to empty path to default route
{ path: 'books', component: BookListComponent }, // Define your routes
{ path: 'add-book', component: BookFormComponent }, 
{ path: '**', redirectTo: '/books' },// Wildcard route to catch undefined routes
//{ loadChildren: () => import('./components/book-form/book-form.module').then(m => m.BookFormModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
