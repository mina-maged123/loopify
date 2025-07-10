// rewards.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Irewards } from '../models/irewards';
import { ResponseGetAll } from '../models/response-get-all.model';
import { baseUrl } from '../shared/endpoints';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private readonly rewardsUrl = `${baseUrl}Rewards`;

  constructor(private http: HttpClient) {}

  getAllRewards(): Observable<ResponseGetAll<Irewards>> {
    return this.http.get<ResponseGetAll<Irewards>>(this.rewardsUrl);
  }
}
