import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './primeng.module';
import { TranslateModule } from '@ngx-translate/core';

//components gp
import { CardComponent } from '../components/card/card.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { MenuButtonsTableComponent } from '../components/menu-buttons-table/menu-buttons-table.component';
import { FormIsvalidComponent } from 'src/app/base/components/form-isvalid/form-isvalid.component';
import { FormControlComponent } from 'src/app/base/components/form-control/form-control.component';
import { FileSizePipe } from '../tools/pipes/file-size.pipe';
import { FileExtensionPipe } from '../tools/pipes/file-extension.pipe';

@NgModule({
  declarations: [
    CardComponent,
    DialogComponent,
    MenuButtonsTableComponent,
    //pipes
    FileSizePipe,
    FileExtensionPipe
  ],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    //components base to gp
    FormIsvalidComponent,
    FormControlComponent,
  ],
  exports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    //components gp
    CardComponent,
    DialogComponent,
    MenuButtonsTableComponent,
    //components base to gp
    FormIsvalidComponent,
    FormControlComponent,
    //pipes
    FileSizePipe,
    FileExtensionPipe
  ],
})
export class SharedModule {}
