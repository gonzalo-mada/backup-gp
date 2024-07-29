import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TestingModule } from '../../modules/testing.module';
import { HomeMenuButtonsComponent } from '../../components/home-menu-buttons/home-menu-buttons.component';

describe('HomeComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [HomeComponent, HomeMenuButtonsComponent],
    }),
  );

  it('[1] Existe', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
