import { TestBed } from '@angular/core/testing';

import { SessionValidatorGuard } from './session-validator.guard';

describe('SessionValidatorGuard', () => {
  let guard: SessionValidatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SessionValidatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
