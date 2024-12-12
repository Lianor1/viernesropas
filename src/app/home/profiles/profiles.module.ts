import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProfilesComponent } from './profiles.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ProfilesComponent],
  exports: [ProfilesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfilesModule {} 