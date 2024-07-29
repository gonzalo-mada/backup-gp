import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { FormControlComponent } from './form-control.component';
import { SystemService } from '../../services/system.service';
import { TestingBaseModule } from '../../modules/testing.module';
import { FormControl } from '@angular/forms';
import { SystemServiceMock } from '../../test/mocks/system.service.mock';

describe('FormControlComponent', () => {
  let component: FormControlComponent;
  let fixture: ComponentFixture<FormControlComponent>;
  let systemServiceMock: SystemServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingBaseModule, FormControlComponent],
      declarations: [],
      providers: [
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    systemServiceMock = TestBed.inject(SystemService) as any;

    fixture = TestBed.createComponent(FormControlComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe: con formControl', () => {
    component.control = new FormControl<any>('form field');
    spyOn(component, 'setValues').and.callFake(() => Promise.resolve());
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.setValues).toHaveBeenCalled();
    expect(component.show).toBeTrue();
  });

  it('[2] Existe: sin formControl', () => {
    component.control = undefined;
    spyOn(component, 'setValues').and.callFake(() => Promise.resolve());
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.setValues).not.toHaveBeenCalled();
    expect(component.show).toBeFalse();
  });

  it('[3] Evento: translate', () => {
    component.control = new FormControl<any>('angular unit test');
    spyOn(component, 'setValues').and.callFake(() => Promise.resolve());
    fixture.detectChanges();
    systemServiceMock['translateSubject'].next({});
    expect(component.setValues).toHaveBeenCalled();
  });

  it('[4] Generar mensajes de error: setValues()', fakeAsync(async () => {
    const t = {
      form: {
        required: 'Campo obligatorio',
        pattern: 'Campo inválido',
        email: 'Correo inválido',
        maxlength: 'Largo máx inválido',
        minlength: 'Largo mín inválido',
        min: 'Valor mín inválido',
        max: 'Valor máx inválido',
        empty: 'Campo obligatorio',
        valid: 'Formulario válido',
        invalid: 'Formulario inválido',
        rut: 'Rut inválido',
        test_error: 'Test mensaje',
      },
    } as any;
    spyOn(systemServiceMock, 'translate').and.callFake(() => {
      return Promise.resolve(t);
    });
    component.project_form_validator = ['test_error'];
    await component.setValues();
    expect(systemServiceMock.translate).toHaveBeenCalledWith(['form']);
    tick();
    for (const k in component.msgs) {
      expect(component.msgs[k] === t.form[k]).toBe(true);
    }
  }));
});
