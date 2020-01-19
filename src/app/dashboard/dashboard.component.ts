import { Component, OnInit, Output, HostBinding, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DataService } from '../service/data.service';

declare var google: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  genresPopularityData : any;
  groupeMembersData : any;
  songsLanguagesStats : any;
  bestArtistsWithMostAlbums : any;
  bestMembersWithTheMostBands : any;
  albumsStatsOfArtiste : any;
  showLineChart: boolean = false;
  showTableChart: boolean = false;

  @HostBinding('class.artiste')
  artiste = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.genresPopularityData = [];
    this.songsLanguagesStats = [];
    this.bestArtistsWithMostAlbums = [];
    this.bestMembersWithTheMostBands = [];
    this.groupeMembersData = [];
    this.albumsStatsOfArtiste = [];
    

    this.dataService.getGenresPopularity().subscribe( res => {
        res.forEach(element => this.genresPopularityData.push([element._id, element.sum]) );
        this.init();
      }
    );

    this.dataService.getSongsLanguagesStats().subscribe( res => {
      res.forEach(element => this.songsLanguagesStats.push([element._id, element.sum]) );
      this.init();
    });

    this.dataService.getBestArtistsWithMostAlbums().subscribe( res => {
      res.forEach(element => this.bestArtistsWithMostAlbums.push([element.name, element.sum]) );
      this.init();
    });

    this.dataService.getBestMembersWithTheMostBands().subscribe( res => {
      res.forEach(element => this.bestMembersWithTheMostBands.push([element.membername, element.sum]) );
      this.init();
    });
  }

  initGroupInfos(artiste: string) {
    this.groupeMembersData = [];
    this.albumsStatsOfArtiste = [];
    
    this.dataService.getArtisteInfo(artiste).subscribe( res => {
      res.members.forEach(element => this.groupeMembersData.push([element.name, element.begin, element.ended]) );
      
      if (res.members.length == 0) {
        this.showTableChart = false;
      } else {
        this.showTableChart = true;
      }

      res.albums.forEach(album => this.albumsStatsOfArtiste.push([album.publicationDate, album.songs.length]));
      if (this.albumsStatsOfArtiste.length == 0) {
        this.showLineChart = false;
      } else {
        this.showLineChart = true;
      }
      this.init();
    });

  }

  init(): void {
    if (typeof(google) !== 'undefined') {
      google.charts.load('current', {'packages': ['corechart','table']});
      setTimeout(() => {
        google.charts.setOnLoadCallback(this.displayGraphs());
      }, 1000);
    }
  }

  displayGraphs(): void {
    this.display3dPieChart();
    this.displayBarChart();
    this.displayColumnChart();
    this.displayDonutChart();
    if (this.showTableChart)
      this.displayTableChart();
      
    if (this.showLineChart)
      this.displayLineChart();
  }

  display3dPieChart(): void {
    const el = document.getElementById('3d_pie_chart');
    const chart = new google.visualization.PieChart(el);
    const options = this.getoptions('Get 4 members with the most bands')
    options['is3D'] = true;
    options['legend'] = 'none';
    options['pieSliceText'] = 'label';
    chart.draw(this.getDataTableBestMembersWithTheMostBands(), options);
  }

  displayDonutChart(): void {
    const el = document.getElementById('donut_chart');
    const chart = new google.visualization.PieChart(el);
    var options = this.getoptions('4 best artists by sum of albums');

    options['legend'] = 'none';
    options['pieSliceText'] = 'label';
    options['slices'] = {  4: {offset: 0.2},
                12: {offset: 0.3},
                14: {offset: 0.4},
                15: {offset: 0.5},
      };
      options['is3D'] = true;
    chart.draw(this.getDataTablegetBestArtistsWithMostAlbums(), options);
  }

  displayBarChart(): void {
    const el = document.getElementById('bar_chart');
    const chart = new google.visualization.BarChart(el);

    chart.draw(this.getDataTableSongsLanguagesStats(), this.getoptions('Songs sum by Languages'));
  }

  displayLineChart(): void {
    const el = document.getElementById('line_chart');
    const chart = new google.visualization.LineChart(el);
    const options = this.getoptions('Get artiste sum of songs by date');

    options['width'] = 800;
    options['height'] = 600;
    
      chart.draw(this.getDataTableAlbumsStatsOfArtiste(), options);
  }

  displayColumnChart(): void {
    const el = document.getElementById('column_chart');
    const chart = new google.visualization.ColumnChart(el);
    
    chart.draw(this.getDataTableGenresPopularity(), this.getoptions('Popularite par genres'));
  }

  displayTableChart(): void {
    const el = document.getElementById('table_chart');
    const chart = new google.visualization.Table(el);
    var data = this.getDataTableGroupeOrMembers()
    
      chart.draw(data, this.getTableOption('Membres du groupe'));
  }

  getDataTableGenresPopularity(): any {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Genre');
    data.addColumn('number', 'sum');
    data.addRows(this.genresPopularityData);

    return data;
  }

  getDataTablegetBestArtistsWithMostAlbums(): any {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'name');
    data.addColumn('number', 'sum');
    data.addRows(this.bestArtistsWithMostAlbums);

    return data;
  }

  getDataTableBestMembersWithTheMostBands(): any {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'memeber name');
    data.addColumn('number', 'sum');
    data.addRows(this.bestMembersWithTheMostBands);

    return data;
  }

  getDataTableSongsLanguagesStats(): any {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'langage');
    data.addColumn('number', 'sum');
    data.addRows(this.songsLanguagesStats);

    return data;
  }

  getDataTableAlbumsStatsOfArtiste(): any {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'date')
    data.addColumn('number', 'nombre de songs')
    data.addRows(this.albumsStatsOfArtiste)
    return data;
  }

  getDataTableGroupeOrMembers(): any {
    const data = new google.visualization.DataTable();

    data.addColumn('string', 'Nom');
    data.addColumn('string', 'date Debut dans le group');
    data.addColumn('boolean', 'quitte le groupe');
    data.addRows(this.groupeMembersData);

    return data;
  }

  getoptions(title: string): any {
    return {
      'title': title,
      'width': 500,
      'height': 400
    };
  }

  getTableOption(title: string) : any {
    return {'title': title, showRowNumber: true, width: '80%', height: '100%'};
  }

}
