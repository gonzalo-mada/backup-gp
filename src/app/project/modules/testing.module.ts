import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../modules/primeng.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientTestingModule,
    TranslateModule.forRoot(),
    PrimengModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientTestingModule,
    TranslateModule,
    PrimengModule,
    ReactiveFormsModule,
  ],
})
export class TestingModule {}
