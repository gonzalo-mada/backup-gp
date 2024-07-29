import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimbologiaComponent } from './simbologia.component';
import { InitService } from 'src/app/base/services/init.service';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';

describe('SimbologiaComponent', () => {
  let component: SimbologiaComponent;
  let fixture: ComponentFixture<SimbologiaComponent>;

  const config = {
    system: {
      icons: {
        home: 'pi pi-home',
        develop: 'pi pi-code',
        develop_page: 'fa-solid fa-trowel-bricks',
        maintenance: 'pi pi-cog',
        maintenance_page: 'fa-solid fa-screwdriver-wrench',
        error_page: 'fa-regular fa-times-circle',
        portal: 'fa-solid fa-building-columns',
        ayuda: 'pi pi-question-circle',
        sistemas: 'pi pi-th-large',
        avisos: 'pi pi-bell',
        contacto: 'pi pi-comments',
        simbologia: 'fa-solid fa-icons',
        manual: 'fa-solid fa-book-open-reader',
        profile: 'pi pi-user',
        correo: 'pi pi-envelope',
        cambiaclave: 'pi pi-key',
        logout: 'pi pi-sign-out',
        login: 'pi pi-sign-in',
        translate: 'pi pi-language',
        modulos: 'pi pi-desktop',
        aplicaciones: 'pi pi-globe',
        menus: 'pi pi-bars',
        sesion_page: 'fa-solid fa-user-clock',
        theme: 'fa-solid fa-universal-access',
      },
      buttons: {
        home: true,
        theme: {
          active: true,
        },
        sistemas: {
          active: true,
          children: {
            aplicaciones: true,
            modulos: true,
          },
        },
        menus: {
          active: true,
          metodo_active: '',
        },
        avisos: true,
        portal: true,
        ayuda: {
          active: true,
          children: {
            contacto: true,
            simbologia: true,
            manual: false,
          },
        },
        usuario: {
          active: true,
          children: {
            profile: true,
            correo: true,
            cambiaclave: true,
            logout: true,
          },
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [SimbologiaComponent],
      providers: [
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimbologiaComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    expect(component).toBeTruthy();
    expect(component.show).toBeFalse();
    expect(component.simbolos.length).toBe(0);
  });

  it('[2] Mostrar simbologia: showSimbologia()', () => {
    spyOn(component, 'setSimbologia').and.callFake(() => null);
    component.showSimbologia();
    expect(component.show).toBe(true);
  });

  it('[3] Procesar simbologia: setSimbologia()', () => {
    component.setSimbologia();
    expect(component.simbolos.length).toBeGreaterThan(0);
  });
});
