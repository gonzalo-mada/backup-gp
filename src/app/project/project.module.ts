import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './routes/project-routing.module';
import { SharedModule } from './modules/shared.module';
import { PrimengModule } from './modules/primeng.module';
import { HomeComponent } from './pages/home/home.component';
import { HomeMenuButtonsComponent } from './components/home-menu-buttons/home-menu-buttons.component';

@NgModule({
  declarations: [HomeComponent, HomeMenuButtonsComponent],
  imports: [CommonModule, ProjectRoutingModule, SharedModule, PrimengModule],
  exports: [ProjectRoutingModule],
})
export class ProjectModule {}
