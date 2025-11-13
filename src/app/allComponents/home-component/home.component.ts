import { Highchart } from './../../models/highchart';
import { companyNews } from './../../models/companyNews';
import { peers } from './../../models/peers';
import { insiderSentiments } from './../../models/sentiments';
import { rTrends } from './../../models/rTrends';
import { stockPrice } from './../../models/stockPrice';
import { DataService } from './../../data.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  startWith,
  map,
  finalize,
  tap,
  catchError,
  switchMap,
  filter,
  debounceTime,
} from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_indicators from 'highcharts/indicators/indicators';
import HC_vbp from 'highcharts/indicators/volume-by-price';
import { TemplateRef, Inject } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../shared.service';
import { earnings } from '../../models/earnings';

HC_stock(Highcharts);
HC_indicators(Highcharts);
HC_vbp(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {};

  updateFlag = false;

  public barChartOptions: Highcharts.Options = {};

  public splineChartOptions: Highcharts.Options = {};

  positiveChange: boolean = false;

  public smaChartOptions: Highcharts.Options = {};

  public positiveSumChange = 0;
  public negativeSumChange = 0;
  public positiveSumMspr = 0;
  public negativeSumMspr = 0;
  public totalSumChange = 0;
  public totalSumMspr = 0;
  starClicked: boolean = false;
  buyClicked: boolean = false;
  stockData: any;
  peers: any;
  error: string;
  stockPrice: any;
  companyNews: any;
  insiderSentiments: any;
  currentNewsItem: any;
  Highchart: Highchart[];
  rTrends: rTrends[];
  earnings: earnings[];
  highchartSummary: Highchart[];
  watchlistData: any;
  watchlists: any[];
  portfolioData: any;
  purchaseSuccess: boolean = false;
  quantity: number;
  walletData: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private data: DataService
  ) {}
  control = new FormControl('');
  symbols: string[] = [];
  symbolValue: string;
  filteredSymbols: Observable<string[]>;
  searching = false;
  noMatchFound = false;
  noInputEntered = false;
  isStockBought = false;
  closeResult = '';

  ngOnInit() {
    this.filteredSymbols = this.control.valueChanges.pipe(
      tap(() => (this.searching = true)),
      debounceTime(300),
      switchMap((value) => this._fetchData(value ?? '')),
      finalize(() => (this.searching = false))
    );
    this.data.currentSearch.subscribe((search) =>
      this.control.setValue(search)
    );
  }

  private _fetchData(value: string): Observable<string[]> {
    if (!value) {
      return of([]);
    }
    return this.http
      .get<any>('http://localhost:3000/fetch-data', {
        params: { search: value },
      })
      .pipe(
        map((data: { result?: any[] }) => {
          if (!data.result) {
            return [];
          }
          this.symbols = data.result.map(
            (item: { displaySymbol: any; description: any }) =>
              item.displaySymbol
                ? `${item.displaySymbol} | ${item.description}`
                : ''
          );
          return this.symbols;
        }),
        catchError((error) => {
          console.error(error);
          this.error = 'An error occurred while fetching data';
          return of([]);
        })
      );
  }

  splitStockName(symbol: string): string {
    return symbol.split(' | ')[0];
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.symbols.filter((symbol) =>
      this._normalizeValue(symbol).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  onClear() {
    this.control.reset();
    this.stockData = null;
    this.insiderSentiments = null;
    this.peers = null;
    this.companyNews = null;
    this.stockPrice = null;
    this.noMatchFound = false;
    this.noInputEntered = false;
  }

  onSearch() {
    if (this.control.value) {
      this.router.navigate(['/search', this.control.value]);
    }
  }
}
