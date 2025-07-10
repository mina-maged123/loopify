import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../shared/endpoints';
import { IUserInfo } from '../models/iuser-info';
import { BrowserStorageService } from './browser-storage.service';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient, private browserStorage: BrowserStorageService) { }

  private getToken(): string | null {
    return this.browserStorage.getItem('token');
  }

  GetUser(userId: number): Observable<IUserInfo> {
    const token = this.getToken();
    console.log(token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<IUserInfo>(ENDPOINTS.GET_USER(userId), { headers });
  }
}
