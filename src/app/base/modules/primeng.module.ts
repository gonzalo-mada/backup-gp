import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [],
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    ToastModule,
    ScrollTopModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    ConfirmDialogModule,
    DialogModule,
    SidebarModule,
    InputTextModule,
    InputTextareaModule,
    PanelMenuModule,
    PanelModule,
    BreadcrumbModule,
    AccordionModule,
    CardModule,
    RadioButtonModule,
    DropdownModule,
  ],
  exports: [
    ToastModule,
    ScrollTopModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    ConfirmDialogModule,
    DialogModule,
    SidebarModule,
    InputTextModule,
    InputTextareaModule,
    PanelMenuModule,
    PanelModule,
    BreadcrumbModule,
    AccordionModule,
    CardModule,
    RadioButtonModule,
    DropdownModule,
  ],
})
export class PrimengModule {}
