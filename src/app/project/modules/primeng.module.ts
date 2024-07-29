import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [],
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    CardModule,
  ],
  exports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    CardModule,
  ],
})
export class PrimengModule {}
