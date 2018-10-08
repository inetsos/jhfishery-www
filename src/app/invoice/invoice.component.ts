import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class InvoiceComponent implements OnInit {

  invoices: Invoice[];
  mydate = new Date();
  total: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private utilService: UtilService,
  ) { 
    this.invoices = this.route.snapshot.data['invoices'];
  }

  ngOnInit() {
  }

  anotherDay() {
    let today = this.mydate.getFullYear() + "-" + 
      this.utilService.get2digits(this.mydate.getMonth()+1) + "-" + 
      this.utilService.get2digits(this.mydate.getDate());
    this.invoiceService.today(today).
      then((data) => {
        this.invoices = data as Invoice[];
      })
      .catch(response => null);
  }

  getOutSum(invoice: string) : number {
    
    let sum = 0;
    for(let i = 0; i < this.invoices.length; i++) {
      if(this.invoices[i].invoice === invoice)
        sum += this.invoices[i].out_sum;
    }
    return sum;
  }
}
