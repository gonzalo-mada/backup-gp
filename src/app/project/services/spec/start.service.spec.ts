import { TestBed } from '@angular/core/testing';
import { StartService } from '../start.service';
import { TestingModule } from '../../modules/testing.module';

describe('StartService (SERVICE)', () => {
  let service: StartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [StartService],
    });
    service = TestBed.inject(StartService);
  });

  it('[1] Es creado', () => {
    expect(service).toBeTruthy();
  });

  it('[2] Obtiene servicios: startServices()', async () => {
    spyOn(service, 'startServices').and.callThrough();
    await service.startServices();
    expect(service.startServices).toHaveBeenCalled();
  });
});
