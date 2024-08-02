import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BadgeModule } from 'primeng/badge';

import { StepsModule } from 'primeng/steps';

@NgModule({
  declarations: [],
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    CardModule,
    //primeng gp
    BadgeModule,
    DialogModule,
    FileUploadModule,
    InputTextareaModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    StepsModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    CardModule,
    //primeng gp
    BadgeModule,
    DialogModule,
    FileUploadModule,
    InputTextareaModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    StepsModule
  ],
})
export class PrimengModule {}
