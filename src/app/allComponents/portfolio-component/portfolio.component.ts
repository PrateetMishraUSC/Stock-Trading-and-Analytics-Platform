import { Component, TemplateRef } from "@angular/core";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from "../home-component/home.service";
import { SearchService } from "../search-component/search.service";
import { FormControl } from '@angular/forms';



@Component({
    selector:'app-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.css'],
})

export class PortfolioComponent {

  constructor(private modalService: NgbModal, private homeService: HomeService, private searchService: SearchService) { } 

  control = new FormControl();

  price: any;
  portfolio: any[];
  walletMoney: any;
  quantity: number;
  stockSold: boolean = false;
  stockBought: boolean = false;
  stocks: any[] = [];
  avgPriceData: any;
  oldQuantity: number = 0;
  oldPrice: number = 0;
  avgPrice: number;
  isCardVisible: boolean = true;
  noMatchFound = false;
  closeResult = '';
  recentlyTradedStock: string;
  isSpinnerLoading: boolean = false;

  

    ngOnInit(): void {
      this.getPortfolioData();
      this.getWalletMoney();
    }

    clearCard() {
        this.isCardVisible = false;
        this.noMatchFound = true;
    }


    getPortfolioData() {
      this.homeService.portfolioData().subscribe(data => {
        this.portfolio = data;
        console.log("This is portfolio data: ",this.portfolio)
        this.price = {};
    
        if (this.portfolio.length === 0) {
          this.noMatchFound = true;
        }
    
        this.portfolio.forEach(stock => {
          this.homeService.stockPrice(stock.ticker).subscribe(price => {
            this.price[stock.ticker] = price;
    
            this.stocks.push({
              ticker: stock.ticker,
              price: price
            });
          });
        });
        console.log("This is stocks array: ", this.stocks);
      });
    }

    getWalletMoney() {
      this.homeService.walletMoneyData().subscribe(data => {
        this.walletMoney = data;
      });
    }

    getTotalCostPortfolio(stock: any) {
      let totalCost = 0;
      if (this.price[stock.ticker]) {
        totalCost = stock.quantity * this.price[stock.ticker]?.c;
      }
      return totalCost.toFixed(2);
    }

    portfolioBuyModal(buyModal: TemplateRef<any>) {
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
        this.modalService.open(buyModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          },
        );
      }

      portfolioSellModal(sellModal: TemplateRef<any>) {
        this.oldQuantity = 0;
        this.oldPrice = 0;
        this.portfolio.forEach((d) => {
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
          }
        })
        this.modalService.open(sellModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          },
        );
      }

      sellStock(ticker: string, stockname: string, quantity:number, avgPrice: number, wallet:number) {
        this.oldQuantity = 0;
        this.oldPrice = 0;
        this.portfolio.forEach((d) => {
          if(d["ticker"] === ticker) {
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
          }
        })

        this.homeService.stockPrice(ticker).subscribe((price) => {
          const totalValue = Number(price.c) * quantity;
          this.homeService.subtractFromWallet(totalValue + wallet).subscribe(() => {
            this.searchService.addToPortfolio(ticker, stockname,this.oldQuantity - quantity, avgPrice).subscribe(() => {
              this.modalService.dismissAll();
              this.getPortfolioData();
              this.recentlyTradedStock = ticker;
              this.stockSold = true;
              this.homeService.walletMoneyData().subscribe(data => {  
                this.walletMoney = data;
              });
              console.log(this.stockSold);
                setTimeout(() => {
                  this.stockSold = false;
                }, 3000);
            });
          });
        });
      }

      buyStock(ticker: string, stockname: string, quantity:number, avgPrice: number) {
        this.oldQuantity = 0;
        this.oldPrice = 0;
        this.portfolio.forEach((d) => {
          if(d["ticker"] === ticker) {
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
          }
        })

        this.homeService.stockPrice(ticker).subscribe((price) => {
          const totalValue = Number(price.c) * quantity;
          this.homeService.subtractFromWallet(this.walletMoney[0].moneyInWallet - totalValue).subscribe(() => {
            this.searchService.addToPortfolio(ticker, stockname, this.oldQuantity + quantity, avgPrice).subscribe(() => {
              this.getPortfolioData();
              this.modalService.dismissAll();
              this.stockBought = true;
              this.recentlyTradedStock = ticker;
              this.homeService.walletMoneyData().subscribe(data => {  
                this.walletMoney = data;
              });
              setTimeout(() => {
                this.stockBought = false;
              }, 3000);
            });
          });
        });
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
    
}