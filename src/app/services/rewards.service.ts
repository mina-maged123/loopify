import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Irewards } from '../models/irewards';
import { ResponseGetAll } from '../models/response-get-all.model';
import { Response } from '../models/response.model'
import { baseUrl } from '../shared/endpoints';
import { IquentityUserName } from '../models/iquentity-user-name';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private readonly rewardsUrl = `${baseUrl}Rewards`;
  private readonly userTotalUrl = `${baseUrl}User/TotalQuantitywith-userName`;

  constructor(private http: HttpClient) {}

  getAllRewards(): Observable<Irewards[]> {
    return this.http.get<ResponseGetAll<Irewards>>(this.rewardsUrl).pipe(
      map(res => res.data)      
    );
  }
getTotalPoint(): Observable<IquentityUserName> {
  if (typeof window === 'undefined') {
    return new Observable(observer => {
      observer.complete(); 
    });
  }
  const token = localStorage.getItem('token');

  const headers = token
    ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    : {};

  return this.http.get<Response<IquentityUserName>>(`${baseUrl}User/TotalQuantitywith-userName`, headers)
    .pipe(map(res => res.data));
}

}
