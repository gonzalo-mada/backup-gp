import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SistemasComponent } from './sistemas.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InitService } from 'src/app/base/services/init.service';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { InitServiceMock } from 'src/app/base/test/mocks/init.service.mock';

describe('SistemasComponent', () => {
  let component: SistemasComponent;
  let fixture: ComponentFixture<SistemasComponent>;

  const config = {
    system: {
      icons: {
        modulos: 'pi pi-desktop',
        aplicaciones: 'pi pi-globe',
      },
      buttons: {
        sistemas: {
          active: true,
          children: {
            aplicaciones: true,
            modulos: true,
          },
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule],
      declarations: [SistemasComponent],
      providers: [
        {
          provide: InitService,
          useValue: new InitServiceMock(config),
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SistemasComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    expect(component).toBeTruthy();
    expect(component.showSistemas).toBeFalse();
    expect(component.selected).toEqual('modulos');
    expect(component.icons).toEqual({
      modulos: 'pi pi-desktop',
      aplicaciones: 'pi pi-globe',
    });
    expect(component.show).toEqual({
      aplicaciones: true,
      modulos: true,
    });
  });
});
