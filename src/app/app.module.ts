import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './allComponents/home-component/home.component';
import { NavbarComponent } from './allComponents/navbar-component/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioComponent } from './allComponents/portfolio-component/portfolio.component';
import { WatchlistComponent } from './allComponents/watchlist-component/watchlist.component';
import { SearchComponent } from './allComponents/search-component/search.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    WatchlistComponent,
    PortfolioComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    NgbModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    HighchartsChartModule,
    NgbModalModule,
  ],
  providers: [
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
