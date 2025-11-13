import {Component, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from "./../../data.service";
import { Subscription } from 'rxjs';

@Component({
    selector:'app-nav',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent implements OnDestroy {
    private subscription: Subscription;
  
    constructor(private router: Router, private dataService: DataService) { }
  
    onSearchClick() {
      this.subscription = this.dataService.currentSearch.subscribe(search => {
        const symbol = search.split(' ')[0];
        this.router.navigate(['/search', symbol]);
      });
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }