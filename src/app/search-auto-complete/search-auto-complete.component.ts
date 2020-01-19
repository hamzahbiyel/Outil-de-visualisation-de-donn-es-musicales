import { DashboardComponent } from './../dashboard/dashboard.component';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ArtistesService } from '../service/artistes.service';
import { FormControl } from '@angular/forms';

import { Observable} from 'rxjs';

@Component({
  selector: 'app-search-auto-complete',
  templateUrl: './search-auto-complete.component.html',
  styleUrls: ['./search-auto-complete.component.css']
})
export class SearchAutoCompleteComponent implements OnInit {
  artistes$: Observable<any[]>;

  @Input() dashboard: DashboardComponent;

  constructor(private artistesService: ArtistesService) {
  }

  ngOnInit() {
  }

  searchArtistesByKey(searchText) {
    if (searchText.length > 0){
      this.artistes$ = this.artistesService.getArtistesByKey(searchText);
    }
  }


  @HostListener('getData')
  getData(name) {
    this.dashboard.initGroupInfos(name);
  }
}