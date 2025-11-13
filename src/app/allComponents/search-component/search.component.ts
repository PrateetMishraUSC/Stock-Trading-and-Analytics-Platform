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
import { SearchService } from './search.service';
import { ActivatedRoute } from '@angular/router';

HC_stock(Highcharts);
HC_indicators(Highcharts);
HC_vbp(Highcharts);

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
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
  sellSuccess: boolean = false;
  quantity: number;
  walletData: any;
 

  constructor(
    private http: HttpClient,
    private router: Router,
    private data: DataService,
    private modalService: NgbModal,
    private searchService: SearchService,
    private sharedService: SharedService,
    private route: ActivatedRoute
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
  oldQuantity: number = 0;
  oldPrice: number = 0;
  avgPrice: number;

  homeBuyModal(homeBuy: TemplateRef<any>) {
    this.searchService.portfolioData().subscribe((data) => {  
      if(data.length === 0) {
        
      } else {
        data.forEach((d) => {
          if(d["ticker"] === this.control.value) {
            if(d["quantity"] === null) {
              this.oldQuantity = 0;
            } else {
              this.oldQuantity = parseInt(d["quantity"]);
            }
            if(d["avgPrice"] === null) {
              this.oldPrice = 0;
            } else {
              this.oldPrice = parseFloat(d["avgPrice"]);
            }
          } else {
            this.oldQuantity = 0;
            this.oldPrice = 0;
          }
        })
      }
    });
    this.modalService
      .open(homeBuy, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  homeSellModal(homeSell: TemplateRef<any>) {
    this.searchService.portfolioData().subscribe((data) => {  
      if(data.length === 0) {
        
      } else {
        data.forEach((d) => {
          console.log(d);
          if(d["ticker"] === this.control.value) {
            if(d["quantity"] === null) {
              this.oldQuantity = 0;
            } else {
              this.oldQuantity = parseInt(d["quantity"]);
            }
            if(d["avgPrice"] === null) {
              this.oldPrice = 0;
            } else {
              this.oldPrice = parseFloat(d["avgPrice"]);
            }
          } else {
            this.oldQuantity = 0;
            this.oldPrice = 0;
          }
        })
      }
    });
    this.modalService
      .open(homeSell, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  companyNewsModal(content: TemplateRef<any>, newsItem: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    this.currentNewsItem = newsItem;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.filteredSymbols = this.control.valueChanges.pipe(
      tap(() => (this.searching = true)),
      debounceTime(300),
      switchMap((value) => this._fetchData(value ?? '')),
      finalize(() => (this.searching = false))
    );
    this.route.params.subscribe((params) => {
      if (params['ticker']) {
        this.control.setValue(params['ticker']);
        this.onSearch();
      }
    })
    this.searchService.portfolioData().subscribe((stocks) => {
      if(stocks.length !== 0) {
        stocks.forEach((d) => {
          if(d['ticker'] === this.control.value) {
            this.isStockBought = true;
          }
        });
      }
      });
  }

  peerClicked(peer: string) {
    this.router.navigate(['search/', peer]);
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
    this.searchService.watchListData().subscribe((data) => {
      this.watchlistData = data;
      data.forEach((d: any) => {
        if(d['ticker'] === this.control.value) {
          this.starClicked = true;
          this.starColor = 'yellow';
          console.log("matched");
        }
      })
    });
    this.noMatchFound = false;
    this.noInputEntered = false;
    if (!this.control.value) {
      this.noInputEntered = true;
      return;
    }
    if (this.control.value !== null) {
      this.router.navigate(['search/', this.control.value]);
      this.searchService
        .checkTickerExists(this.control.value)
        .subscribe((exists) => {
          if (exists) {    
            if (this.control.value !== null) {
              this.data.changeSearch(this.control.value);
              this.stock(this.control.value);
              this.Price(this.control.value);
              this.rTrendsData(this.control.value);
              this.insiderSentimentsData(this.control.value);
              this.peersData(this.control.value);
              this.earningsData(this.control.value);
              this.companyNewsData(this.control.value);
              this.HighchartData(this.control.value);
              this.highchartSummaryData(this.control.value);
              this.wallet();
            }
          } else {
            this.noMatchFound = true;
            this.stockData = null;
            this.insiderSentiments = null;
            this.peers = null;
            this.companyNews = null;
            this.stockPrice = null;
          }
        });
    } else {
      this.noInputEntered = true;
    }
  }

  starColor: string = 'grey';

  watchlist() {
    this.starClicked = !this.starClicked;
    if (this.starClicked) {
      this.starColor = 'yellow';
      if (this.control.value !== null) {
        this.searchService
          .addToWatchlist(this.control.value, this.stockData.name)
          .subscribe((data) => {
            this.watchlistData = data;
          });
      } else {
        this.starColor = 'grey';
      }
    } else {
      this.starColor = 'grey';
      if (this.control.value !== null) {
        this.searchService.removeFromWatchlist(this.control.value);
      }
    }
  }

    addStock() {
      if (this.control.value !== null) {
      this.avgPrice = (this.oldPrice * this.oldQuantity + this.stockPrice.c * this.quantity) / (this.oldQuantity + this.quantity);
      this.searchService.addToPortfolio(this.control.value, this.stockData.name, this.quantity + this.oldQuantity, this.avgPrice).subscribe((data) => {
        this.portfolioData = data;
        this.modalService.dismissAll();
        this.purchaseSuccess = true;
        setTimeout(() => {
          this.purchaseSuccess = false;
        }, 3000);
        this.isStockBought = true;

        const newWalletValue = this.walletData[0].moneyInWallet - (this.stockPrice.c * this.quantity);
        console.log("New Wallet Value: ",newWalletValue);
        this.searchService.subtractFromWallet(newWalletValue).subscribe(() => {
        this.walletData = newWalletValue;
      });
      });
    }
  }

  removeStock() {
    if (this.control.value !== null) {
      this.searchService.addToPortfolio(this.control.value, this.stockData.name, this.oldQuantity-this.quantity, this.oldPrice ).subscribe((data) => {
        this.portfolioData = data;
        this.modalService.dismissAll();
        this.sellSuccess = true;
        setTimeout(() => {
          this.sellSuccess = false;
        }, 3000);

        const newWalletValue = this.walletData[0].moneyInWallet + (this.stockPrice.c * this.quantity);
        this.searchService.subtractFromWallet(newWalletValue).subscribe(() => {
        this.walletData = newWalletValue;
      });
      });
    }
  }

  wallet() {
    this.searchService.walletMoneyData().subscribe((data) => {
      this.walletData = data;
      console.log("wallet data: ",data);
    });
  }

  isMarketOpen(t: number): boolean {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return now - t * 1000 < fiveMinutes;
  }
  transformTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString().replace(/,/g, '');
  }

  stock(ticker: string) {
    console.log(ticker);
    this.searchService.stockData(ticker).subscribe((data) => {
      this.stockData = data;
      console.log(data);
      this.sharedService.updateData1(data);
    });
  }

  Price(ticker: string) {
    this.searchService.stockPrice(ticker).subscribe((data) => {
      this.stockPrice = data;
      console.log(data);
      this.sharedService.updateData2(data);
      if (data.c >= 0) {
        this.positiveChange = true;
      }
    });
  }

  rTrendsData(ticker: string) {
    this.searchService.rTrends(ticker).subscribe((data) => {
      this.rTrends = data;
      console.log(data);
      const strongBuy: number[] = [];
      const buy: number[] = [];
      const hold: number[] = [];
      const sell: number[] = [];
      const strongSell: number[] = [];
      const categories: string[] = [];
      this.rTrends.forEach((d: rTrends) => {
        strongBuy.push(d['strongBuy']);
        buy.push(d['buy']);
        hold.push(d['hold']);
        sell.push(d['sell']);
        strongSell.push(d['strongSell']);
        categories.push(d['period']);
      });
      this.barChartOptions = {
        chart: {
          type: 'column',
          backgroundColor: '#f7f7f7',
        },

        title: {
          text: 'Recommendation Trends',
          align: 'center',
          style: {
            fontSize: '15px',
          },
        },

        xAxis: {
          categories: categories,
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: '#Analysis',
          },
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              style: {
                textOutline: '0px',
              },
              formatter: function () {
                return this.y;
              },
            },
          },
        },

        series: [
          {
            type: 'column',
            name: 'Strong Buy',
            color: 'darkgreen',
            data: strongBuy,
          },
          {
            type: 'column',
            name: 'Buy',
            color: 'green',
            data: buy,
          },
          {
            type: 'column',
            name: 'Hold',
            color: 'yellow',
            data: hold,
          },
          {
            type: 'column',
            name: 'Sell',
            color: 'orange',
            data: sell,
          },
          {
            type: 'column',
            name: 'Strong Sell',
            color: 'red',
            data: strongSell,
          },
        ],
      };
    });
  }

  insiderSentimentsData(ticker: string) {
    this.searchService.insiderSentiments(ticker).subscribe((data) => {
      this.insiderSentiments = data;
      this.calculateSums(this.insiderSentiments);
      console.log(data);
    });
  }

  calculateSums(response: any) {
    this.positiveSumChange = 0;
    this.negativeSumChange = 0;
    this.positiveSumMspr = 0;
    this.negativeSumMspr = 0;
    this.totalSumChange = 0;
    this.totalSumMspr = 0;

    response.data.forEach((item: { change: number; mspr: number }) => {
      if (item.change > 0) {
        this.positiveSumChange += item.change;
        this.positiveSumMspr += item.mspr;
      } else {
        this.negativeSumChange += item.change;
        this.negativeSumMspr += item.mspr;
      }
      this.totalSumChange += item.change;
      this.totalSumMspr += item.mspr;
    });
    this.positiveSumChange = parseFloat(this.positiveSumChange.toFixed(2));
    this.negativeSumChange = parseFloat(this.negativeSumChange.toFixed(2));
    this.positiveSumMspr = parseFloat(this.positiveSumMspr.toFixed(2));
    this.negativeSumMspr = parseFloat(this.negativeSumMspr.toFixed(2));
    this.totalSumMspr = parseFloat(this.totalSumMspr.toFixed(2));
  }

  peersData(ticker: string) {
    this.searchService.peers(ticker).subscribe((data) => {
      this.peers = data;
      console.log(data);
    });
  }

  earningsData(ticker: string) {
    this.searchService.earnings(ticker).subscribe((data) => {
      this.earnings = data;
      console.log(data);
      const actual: number[] = [];
      const estimate: number[] = [];
      const surprise: number[] = [];
      const period: string[] = [];
      this.earnings.forEach((d: earnings) => {
        actual.push(d['actual']);
        estimate.push(d['estimate']);
        surprise.push(d['surprise']);
        period.push(d['period']);
      });
      let xAxis = [];
      for (let i = 0; i < period.length; i++) {
        xAxis.push(period[i] + ' ' + 'surprise:' + surprise[i]);
      }
      this.splineChartOptions = {
        chart: {
          type: 'spline',
          backgroundColor: '#f7f7f7',
        },
        title: {
          text: 'Historical EPS Surprises',
          align: 'center',
          style: {
            fontSize: '15px',
          },
        },
        xAxis: {
          categories: xAxis,
        },
        yAxis: {
          title: {
            text: 'quaterly EPS',
          },
          labels: {
            format: '{value}°',
          },
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1,
            },
          },
        },
        series: [
          {
            type: 'line',
            name: 'Actual',
            marker: {
              symbol: 'square',
            },
            data: actual,
          },
          {
            type: 'line',
            name: 'Estimate',
            marker: {
              symbol: 'diamond',
            },
            data: estimate,
          },
        ],
      };
    });
  }

  highchartSummaryData(ticker: string) {
    this.searchService.highchartSummary(ticker).subscribe((data) => {
      this.highchartSummary = data;
      console.log('summary: ', data);
      const price: number[][] = [];
      const period: string[] = [];

      this.highchartSummary.forEach((d: Highchart) => {
        price.push([d.t, d.c]);
      });
      console.log('price: ', price);
      console.log('period: ', period);
      this.chartOptions = {
        chart: {
          backgroundColor: '#f7f7f7',
        },

        title: {
          text: this.control.value + ' Hourly Price Variation',
          align: 'center',
          style: {
            color: '#bcbcbc',
            fontSize: '15px',
          },
        },
        yAxis: {
          opposite: true,
        },
        xAxis: {
          type: 'datetime',
        },
        plotOptions: {
          series: {
            marker: {
              enabled: false,
            },
          },
        },
        series: [
          {
            type: 'line',
            data: price,
            color: this.isMarketOpen(Number(period)) ? 'green' : 'red',
            showInLegend: false,
          },
        ],
      };
    });
  }

  companyNewsData(ticker: string) {
    this.searchService.companyNews(ticker).subscribe((data) => {
      this.companyNews = data;
      console.log(data);
    });
  }

  HighchartData(ticker: string) {
    this.searchService.Highchart(ticker).subscribe((data) => {
      this.Highchart = data;
      console.log(data);
      let candlestickValues: number[][] = [];
      let volumeValues: number[][] = [];
      this.Highchart.forEach((d: Highchart) => {
        candlestickValues.push([d['t'], d['o'], d['h'], d['l'], d['c']]);
        volumeValues.push([d['t'], d['v']]);
      });
      let sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      this.smaChartOptions = {
        rangeSelector: {
          enabled: true,
          inputEnabled: false,
          allButtonsEnabled: true,
          buttons: [
            {
              type: 'month',
              count: 1,
              text: '1m',
            },
            {
              type: 'month',
              count: 3,
              text: '3m',
            },
            {
              type: 'month',
              count: 6,
              text: '6m',
            },
            {
              type: 'ytd',
              text: 'YTD',
            },
            {
              type: 'year',
              count: 1,
              text: '1y',
            },
            {
              type: 'all',
              text: 'All',
            },
          ],
          selected: 2,
        },
        navigator: {
          enabled: true,
        },
        scrollbar: {
          enabled: true,
        },
        title: {
          text: this.control.value + ' Historical',
        },
        subtitle: {
          text: 'With SMA and Volume by Price technical indicators',
        },

        xAxis: {
          type: 'datetime',
          ordinal: true,
          min: sixMonthsAgo.getTime(),
          max: new Date().getTime(),
        },
        yAxis: [
          {
            labels: {
              align: 'right',
              x: -3,
            },
            title: {
              text: 'OHLC',
            },
            height: '60%',
            lineWidth: 2,
            lineColor: 'black',
            offset: 2,
            resize: {
              enabled: true,
            },
            opposite: true,
          },
          {
            labels: {
              align: 'right',
              x: -3,
              y: -10,
            },
            title: {
              text: 'Volume',
            },

            top: '65%',
            height: '35%',
            offset: 2,
            lineWidth: 2,
            lineColor: 'black',
            opposite: true,
          },
        ],

        series: [
          {
            type: 'candlestick',
            name: 'AAPL',
            id: 'aapl',
            yAxis: 0,
            data: candlestickValues,
          },
          {
            type: 'column',
            id: 'volume',
            color: '#6e4fd9', // Blue color
            borderRadius: 5,
            yAxis: 1,
            data: volumeValues,
          },
          {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
              volumeSeriesID: 'volume',
            },
            dataLabels: {
              enabled: false,
            },
            zoneLines: {
              enabled: false,
            },
          },
          {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
              enabled: false,
            },
            params: {
              period: 14,
              index: 3,
            },
          },
        ],
      };
      this.updateFlag = true;
    });
  }
}
