import { WatchlistComponent } from './allComponents/watchlist-component/watchlist.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from './allComponents/portfolio-component/portfolio.component';
import { HomeComponent } from './allComponents/home-component/home.component';
import { SearchComponent } from './allComponents/search-component/search.component';

const routes: Routes = [
  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  { path: "search/home", component: HomeComponent },
  { path: "search/:ticker", component: SearchComponent },
  { path: "watchlist", component: WatchlistComponent },
  { path: "portfolio", component: PortfolioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
