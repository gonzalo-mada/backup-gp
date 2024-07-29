import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampusRoutingModule } from './campus-routing.module';
import { CampusComponent } from './campus.component';
import { PrimengModule } from '../../modules/primeng.module';
import { SharedModule } from '../../modules/shared.module';


@NgModule({
  declarations: [
    CampusComponent
  ],
  imports: [
    CommonModule,
    CampusRoutingModule,
    PrimengModule,
    SharedModule
  ]
})
export class CampusModule { }
