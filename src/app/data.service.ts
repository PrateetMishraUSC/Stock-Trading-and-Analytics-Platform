// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private searchSource = new BehaviorSubject('');
  currentSearch = this.searchSource.asObservable();
message: any;

  constructor() { }

  changeSearch(search: string) {
    this.searchSource.next(search)
  }
}