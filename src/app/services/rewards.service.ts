import { ICreateRedeemReward } from './../models/ICreateRedeemReward';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Irewards } from '../models/irewards';
import { ResponseGetAll } from '../models/response-get-all.model';
import { Response } from '../models/response.model'
import { baseUrl, ENDPOINTS } from '../shared/endpoints';
import { IquentityUserName } from '../models/iquentity-user-name';
import { ICreateGift } from '../models/ICreateGift';
import { IUpdateGift } from '../models/IUpdateGift';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private readonly rewardsUrl = `${baseUrl}Rewards`;
  private readonly userTotalUrl = `${baseUrl}User/TotalQuantitywith-userName`;

  constructor(private http: HttpClient) { }

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

  postRedeemReward(rewardId: number, quantity: number): Observable<any> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let userId = Number(localStorage.getItem('id'));

    let data: ICreateRedeemReward = {
      userId: userId,
      rewardId: rewardId,
      quantity: quantity
    };

    return this.http.post<any>(ENDPOINTS.POST_REDEEM_REWARD, data, { headers: headers });
  }

  postNewGift(data:ICreateGift) : Observable<Response<any>>{
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    return this.http.post<Response<any>>(ENDPOINTS.POST_NEW_REWARD, data, {headers: headers});
  }

  updateGift(rewardId:number, data:IUpdateGift) : Observable<Response<any>>{
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<Response<any>>(ENDPOINTS.UPDATE_REWARD(rewardId), data, {headers: headers});
  }

  removeGift(rewardId:number) : Observable<Response<any>>{
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<Response<any>>(ENDPOINTS.DELETE_REWARD(rewardId), {headers: headers});
  }

}
