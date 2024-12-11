import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { VaucherDetallePage } from './vaucher-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: VaucherDetallePage
      }
    ])
  ],
  declarations: [VaucherDetallePage]
})
export class VaucherDetallePageModule {} 