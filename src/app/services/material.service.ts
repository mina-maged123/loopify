import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMaterial } from '../models/IMaterial.model';
import { ENDPOINTS } from '../shared/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private http:HttpClient) { }

  getAllMaterial() : Observable<IMaterial[]>{
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<IMaterial[]>(ENDPOINTS.GET_ALL_MATERIAL, {headers: headers});
  }

  addMaterial(data:any) : Observable<any> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(ENDPOINTS.POST_MATERIAL, data, { headers });
  }

  deleteMaterial(materialId:number) : Observable<any> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(ENDPOINTS.DELETE_MATERIAL(materialId), { headers });
  }

  editMaterial(data:any) : Observable<any> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(ENDPOINTS.UPDATE_MATERIAL, data, { headers });
  }
}
