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

  index(): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  today(today: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${today}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  todayAll(today: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${today}/all`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  todaySale(today: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${today}/sale`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  period(s_day: string, e_day: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${s_day}/${e_day}/period`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  periodAll(s_day: string, e_day: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/periodAll/${s_day}/${e_day}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  periodSale(s_day: string, e_day: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/periodSale/${s_day}/${e_day}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  periodDeadline(s_day: string): Promise<Invoice[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/periodDeadline/${s_day}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice[];
              })
              .catch(this.utilService.handleApiError);
  }

  destroy(id: string): Promise<Invoice> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/${id}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice;
              })
              .catch(this.utilService.handleApiError);
  }

  update(id: string, invoice: Invoice): Promise<Invoice> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/${id}`, invoice)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice;
              })
              .catch(this.utilService.handleApiError);
  }

  //////////////////////////////////////////////
  show(userID: string): Promise<Invoice> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${userID}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice;
              })
              .catch(this.utilService.handleApiError);
  }

  create(user: Invoice): Promise<Invoice> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}`, user)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Invoice;
              })
              .catch(this.utilService.handleApiError);
  }
}
