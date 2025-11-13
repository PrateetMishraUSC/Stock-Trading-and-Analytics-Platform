import { Component } from "@angular/core";
import { SharedService } from '../../shared.service';
import { HomeService } from "../home-component/home.service";
import { FormControl } from "@angular/forms";


@Component({
    selector:'app-watchlist',
    templateUrl: './watchlist.component.html',
    styleUrls: ['./watchlist.component.css'],
})

export class WatchlistComponent {
    control = new FormControl('');
    noMatchFound = false;
    stockPrice: any;
    price: any;
    stockdata: any;
    http: any;
    watchlist: any[] = [];


    constructor(private homeService: HomeService) { } 

    ngOnInit() {
        this.getWatchList();
        
      }

    clearCard(item: any) {
      const index = this.watchlist.indexOf(item);
      if (index > -1) {
          this.watchlist.splice(index, 1);
          this.homeService.removeFromWatchlist(item.ticker);
      } else {
        this.noMatchFound = true;
      }
    }

    getWatchList() {
      this.homeService.watchListData().subscribe(data => {
        this.watchlist = data;    
        this.price = {}; 
        this.watchlist.forEach(stock => {
          this.homeService.stockPrice(stock.ticker).subscribe(price => {
            this.price[stock.ticker] = price;
            console.log("wishlistPriceData: ",price)
          });
        });
      });
    }
}
