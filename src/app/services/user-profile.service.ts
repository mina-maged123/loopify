import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { IUserInfo } from '../models/iuser-info';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService implements OnInit {
  private userToken: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.userToken = localStorage.getItem('token');
  }

  private getToken(): string {
    return this.userToken || '';
  }

  GetUser(userId: number): Observable<IUserInfo> {
    console.log(this.getToken())
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<IUserInfo>(ENDPOINTS.GET_USER(userId), { headers });
  }
}
