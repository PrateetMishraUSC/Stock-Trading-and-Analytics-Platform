import { Highchart } from './../../models/highchart';
import { earnings } from './../../models/earnings';
import { peers } from './../../models/peers';
import { insiderSentiments } from './../../models/sentiments';
import { rTrends } from './../../models/rTrends';
import { autoComplete } from './../../models/automcomplete';
import { companyNews } from './../../models/companyNews';
import { stockPrice } from './../../models/stockPrice';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Stock } from '../../models/stock';
import { map, filter, catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  stockData(ticker: string) : Observable<Stock> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/profile?ticker=" + ticker;
    return this.http.get<Stock>(url);
  }

  stockPrice(ticker: string) : Observable<stockPrice> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/stockprice?ticker=" + ticker;
    return this.http.get<stockPrice>(url);
  }

  rTrends(ticker: string) : Observable<rTrends[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/rtrends?ticker=" + ticker;
    return this.http.get<rTrends[]>(url);
  }

  insiderSentiments(ticker: string) : Observable<insiderSentiments> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/sentiments?ticker=" + ticker;
    return this.http.get<insiderSentiments>(url);
  }

  peers(ticker: string) : Observable<peers> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/peers?ticker=" + ticker;
    return this.http.get<peers>(url);
  }

  earnings(ticker: string) : Observable<earnings[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/earnings?ticker=" + ticker;
    return this.http.get<earnings[]>(url);
  }

  companyNews(ticker: string) : Observable<companyNews[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/companynews?ticker=" + ticker;
    return this.http.get<companyNews[]>(url).pipe(
      map(news => news.filter(item => item.image !== '')), 
      map(news => news.slice(0, 20))
    );
  }

  Highchart(ticker: string) : Observable<Highchart[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/highcharts?ticker=" + ticker;
    return this.http.get<Highchart[]>(url);
  }
  
  highchartSummary(ticker: string) : Observable<Highchart[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/highchartsummary?ticker=" + ticker;
    return this.http.get<Highchart[]>(url);
  }

  checkTickerExists(ticker: string) : Observable<boolean> {
    let url = "https://responsivestocks.wm.r.appspot.com/api/data/profile?ticker=" + ticker;
    return this.http.get(url).pipe(
      map(response => Object.keys(response).length > 0), 
      catchError(() => of(false)) 
    );
  }

  watchListData() : Observable<any[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/watchlist";
    return this.http.get<any[]>(url);
  }

  addToWatchlist(ticker: string, stockname: string): Observable<any> {
    let url = "https://responsivestocks.wm.r.appspot.com/addToWatchlist?ticker="+ticker+"&stockname="+stockname;
    return this.http.get(url);
  }

  removeFromWatchlist(ticker: string): void {
    let url = "https://responsivestocks.wm.r.appspot.com/removeWatchlist?ticker="+ticker;
    this.http.get(url).subscribe();
  }

  portfolioData(): Observable<any[]> {
    let url = "https://responsivestocks.wm.r.appspot.com/portfolio";
    return this.http.get<any[]>(url);
  }

  addToPortfolio(ticker: string, stockname: string, quantity:number, avgPrice: number): Observable<any> {
    let url = "https://responsivestocks.wm.r.appspot.com/addToPortfolio?ticker="+ticker+"&stockname="+stockname+"&quantity="+quantity+"&avgPrice="+avgPrice;
    return this.http.get(url);
  }

  removeFromPortfolio(ticker: string): Observable<any> {
    let url = "https://responsivestocks.wm.r.appspot.com/removePortfolio?ticker="+ticker;
    return this.http.get(url);
  }

  walletMoneyData(): Observable<any> {
    let url = "https://responsivestocks.wm.r.appspot.com/walletMoney";
    return this.http.get(url);
  }

  subtractFromWallet(totalValue: number): Observable<any> {
    let url = "https://responsivestocks.wm.r.appspot.com/walletMoneyUpdate?totalValue="+totalValue;
    return this.http.get(url);
  }
}
