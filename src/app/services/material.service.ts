import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMaterial } from '../models/IMaterial.model';
import { ENDPOINTS } from '../shared/endpoints';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private http:HttpClient, private browserStorage: BrowserStorageService) { }

  getAllMaterial() : Observable<IMaterial[]>{
    let token = this.browserStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<IMaterial[]>(ENDPOINTS.GET_ALL_MATERIAL, {headers: headers});
  }
}
