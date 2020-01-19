import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  getGenresPopularity(): Observable<any> {
    return this.http.get('https://wasabi.i3s.unice.fr/api/v1/artist/genres/popularity');
  }

  getArtisteInfo(artist: string): Observable<any> {
    return this.http.get('https://wasabi.i3s.unice.fr/search/artist/' + artist);
  }

  // Get stats about lyrics languages
  getSongsLanguagesStats() : Observable<any> {
    return this.http.get('https://wasabi.i3s.unice.fr/api/v1/song/lyrics/language/popularity')
  }

  // Get 4 best artists with the most albums
  getBestArtistsWithMostAlbums() : Observable<any> {
    return this.http.get('https://wasabi.i3s.unice.fr/api/v1/artist/count/album?limit=4')
  }

  // Get 4 members with the most bands
  getBestMembersWithTheMostBands() : Observable<any> {
    return this.http.get('https://wasabi.i3s.unice.fr/api/v1/artist/member/count/band?limit=4')
  }
  
    

}


