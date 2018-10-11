import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';
import { UtilService } from '../util.service';

import { ExcelService } from '../excel.service';
import { InvoiceEx } from '../invoice_ex';
import { ApiResponse } from '../api-response';

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
  errorResponse: ApiResponse;
  navigationSubscription;
  
  invoiceExs : InvoiceEx[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private utilService: UtilService,
    private excelService:ExcelService
  ) { 
    
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.invoices = this.route.snapshot.data['invoices'];
        this.anotherDay();
      }
    });
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

  deleteInvoice(id: string) {
    var answer = confirm("송품장을 삭제하시겠습니까?");
    if(answer){
      this.invoiceService.destroy(id)
      .then(data => {
        alert('삭제하였습니다.');
        this.router.navigate(['/invoice']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
    }
  }

  exportAsXLSX():void {
    this.makeExport();
    this.excelService.exportAsExcelFile(this.invoiceExs, 'invoice');
  }

  makeExport() {
    let idx = 0;
    for(let i = 0; i < this.invoices.length; i++) {

      let invoiceEx = {} as InvoiceEx;

      invoiceEx.trader = this.invoices[i].trader;
      invoiceEx.in_out = this.invoices[i].in_out;
      invoiceEx.in_date = this.invoices[i].in_date;
      invoiceEx.seller = this.invoices[i].seller;
      invoiceEx.deal_type = this.invoices[i].deal_type;
      invoiceEx.invoice = this.invoices[i].invoice;
      invoiceEx.origin = this.invoices[i].origin;
      invoiceEx.item = this.invoices[i].item;
      invoiceEx.unit = this.invoices[i].unit;
      invoiceEx.quality = this.invoices[i].quality;
      invoiceEx.weight = this.invoices[i].weight;
      invoiceEx.in_number = this.invoices[i].in_number;
      invoiceEx.in_sum = this.invoices[i].in_sum;
      invoiceEx.out_number = this.invoices[i].out_number;
      invoiceEx.out_sum = this.invoices[i].out_sum;
          
      invoiceEx.outDate = '';
      invoiceEx.outNumber = 0;
      invoiceEx.outSum = 0;
      invoiceEx.outPurchase = '';

      this.invoiceExs.push(invoiceEx);    

      for(let j = 0; j < this.invoices[i].unstoring.length; j++) {
      
        let invoiceEx = {} as InvoiceEx;

        invoiceEx.trader = ''; //this.invoices[i].trader;
        invoiceEx.in_out = '';  //this.invoices[i].in_out;
        invoiceEx.in_date = ''; //this.invoices[i].in_date;
        invoiceEx.seller = '';  //this.invoices[i].seller;
        invoiceEx.deal_type = ''; //this.invoices[i].deal_type;
        invoiceEx.invoice = ''; //this.invoices[i].invoice;
        invoiceEx.origin =''; // this.invoices[i].origin;
        invoiceEx.item = '';  //this.invoices[i].item;
        invoiceEx.unit = 0;  //this.invoices[i].unit;
        invoiceEx.quality = ''; //this.invoices[i].quality;
        invoiceEx.weight = ''; //this.invoices[i].weight;
        invoiceEx.in_number = 0;  //this.invoices[i].in_number;
        invoiceEx.in_sum = 0; //this.invoices[i].in_sum;
        invoiceEx.out_number = 0; //this.invoices[i].out_number;
        invoiceEx.out_sum = 0;  //this.invoices[i].out_sum;

        invoiceEx.outDate = this.invoices[i].unstoring[j].outDate;
        invoiceEx.outNumber = this.invoices[i].unstoring[j].outNumber;
        invoiceEx.outSum = this.invoices[i].unstoring[j].outSum;
        invoiceEx.outPurchase = this.invoices[i].unstoring[j].outPurchase;

        this.invoiceExs.push(invoiceEx);
      }
    }
  } 
}
