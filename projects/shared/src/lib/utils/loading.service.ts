import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingStatus } from './utils.model';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}
  loadingStatus = {
    fullPageLoading: false,
    centerLoading: false,
  };

  private loadingState: BehaviorSubject<LoadingStatus> =
    new BehaviorSubject<LoadingStatus>(this.loadingStatus);

  public loadingState$ = this.loadingState.asObservable();

  setLoadingStatus(status: any) {
    this.loadingStatus = { ...this.loadingStatus, ...status };
    this.loadingState.next(this.loadingStatus);
  }
}
