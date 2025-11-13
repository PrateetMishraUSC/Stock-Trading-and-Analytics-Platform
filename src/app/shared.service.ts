// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    private dataSource1 = new BehaviorSubject<any>(null);
    data1 = this.dataSource1.asObservable();
  
    private dataSource2 = new BehaviorSubject<any>(null);
    data2 = this.dataSource2.asObservable();
  
    updateData1(data: any) {
      this.dataSource1.next(data);
    }
  
    updateData2(data: any) {
      this.dataSource2.next(data);
    }
  }