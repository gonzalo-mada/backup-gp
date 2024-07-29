import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AyudaComponent } from './ayuda.component';
import { SystemService } from 'src/app/base/services/system.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderUtils } from 'src/app/base/tools/utils/header.utils';
import { TestingBaseModule } from 'src/app/base/modules/testing.module';
import { HeaderUtilsMock } from 'src/app/base/test/mocks/header.utils.mock';
import { SystemServiceMock } from 'src/app/base/test/mocks/system.service.mock';

describe('AyudaComponent', () => {
  let component: AyudaComponent;
  let fixture: ComponentFixture<AyudaComponent>;
  let headerUtilsMock: HeaderUtilsMock;
  let systemServiceMock: SystemServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingBaseModule, BrowserAnimationsModule],
      declarations: [AyudaComponent],
      providers: [
        {
          provide: SystemService,
          useClass: SystemServiceMock,
        },
        {
          provide: HeaderUtils,
          useClass: HeaderUtilsMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    headerUtilsMock = TestBed.inject(HeaderUtils);
    systemServiceMock = TestBed.inject(SystemService) as any;

    fixture = TestBed.createComponent(AyudaComponent);
    component = fixture.componentInstance;
  });

  it('[1] Existe', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.showAyuda).toBeFalse();
    expect(component.ayudaButtons.length).toBe(0);
  });

  it('[2] Evento: translate', () => {
    spyOn(component as any, 'setAyudaButtons').and.callFake(() => null);
    fixture.detectChanges();
    systemServiceMock['translateSubject'].next({});
    expect(component['setAyudaButtons']).toHaveBeenCalled();
  });

  it('[3] Procesar botones ayuda: setAyudaButtons()', async () => {
    spyOn(headerUtilsMock, 'getAyudaButtons').and.callThrough();
    await component['setAyudaButtons']();
    expect(headerUtilsMock.getAyudaButtons).toHaveBeenCalled();
    expect(component.ayudaButtons.length).toBeGreaterThanOrEqual(0);
  });
});
