import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './primeng.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
