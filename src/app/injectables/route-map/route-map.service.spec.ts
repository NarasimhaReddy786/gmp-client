import { TestBed } from '@angular/core/testing';

import { RouteMapService } from './route-map.service';

describe('RouteMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteMapService = TestBed.get(RouteMapService);
    expect(service).toBeTruthy();
  });
});
