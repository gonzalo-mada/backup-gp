import { TestBed } from '@angular/core/testing';
import { FormIsvalidComponent } from './form-isvalid.component';
import { TestingBaseModule } from '../../modules/testing.module';

describe('FormIsvalidComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule, FormIsvalidComponent],
    });
  });

  it('[1] Existe', () => {
    const fixture = TestBed.createComponent(FormIsvalidComponent);
    const app = fixture.componentInstance;
    expect(typeof app.valid).toBe('boolean');
    expect(app).toBeTruthy();
  });
});
