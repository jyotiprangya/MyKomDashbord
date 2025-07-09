import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [ FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    MatIconModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class FaqModule { }