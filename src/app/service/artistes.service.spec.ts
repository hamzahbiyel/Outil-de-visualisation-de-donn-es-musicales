import { TestBed } from '@angular/core/testing';

import { ArtistesService } from './artistes.service';

describe('ArtistesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtistesService = TestBed.get(ArtistesService);
    expect(service).toBeTruthy();
  });
});
