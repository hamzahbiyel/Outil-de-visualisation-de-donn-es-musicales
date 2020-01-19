import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArtistesService {

  constructor(private http: HttpClient) {}

  getArtistesByKey(key: BehaviorSubject<string>): Observable<any> {
    return this.http.get('https://wasabi.i3s.unice.fr/search/fulltext/' + key).pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
  }
}
