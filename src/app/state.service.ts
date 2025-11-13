import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state: any = {};

  setState(key: string, value: any): void {
    this.state[key] = value;
  }

  getState(key: string): any {
    return this.state[key];
  }
}