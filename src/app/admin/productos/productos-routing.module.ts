import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditarProductoComponent } from './components/editar-producto/editar-producto.component';

import { ProductosPage } from './productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage
  },
  {
    path: 'editar-producto/:id',
    component: EditarProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosPageRoutingModule {}
