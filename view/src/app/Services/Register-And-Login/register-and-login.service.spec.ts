/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterAndLoginService } from './register-and-login.service';

describe('Service: RegisterAndLogin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterAndLoginService]
    });
  });

  it('should ...', inject([RegisterAndLoginService], (service: RegisterAndLoginService) => {
    expect(service).toBeTruthy();
  }));
});
