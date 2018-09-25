import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { Invoice } from './invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiBaseUrl = `${environment.apiBaseUrl}/invoices`;
  
  constructor(
    private http: HttpClient,
    private utilService: UtilService,
  ) { }

  index() : Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[]
              })
              .catch(this.utilService.handleApiError);
  }

  today(today:string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${today}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[]
              })
              .catch(this.utilService.handleApiError);
  }

  //////////////////////////////////////////////
  show(userID: string): Promise<Invoice> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${userID}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice
              })
              .catch(this.utilService.handleApiError);
  }

  create(user: Invoice): Promise<Invoice> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}`, user)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice
              })
              .catch(this.utilService.handleApiError);
  }

  update(userID: string, user: Invoice): Promise<Invoice> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/${userID}`, user)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice
              })
              .catch(this.utilService.handleApiError);
  }

  destroy(userID: string): Promise<Invoice> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/${userID}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice
              })
              .catch(this.utilService.handleApiError);
  }

}
