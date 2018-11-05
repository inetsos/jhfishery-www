import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';
import { Unstoring } from '../unstoring';
import { UnstoringService } from '../unstoring.service';
import { UtilService } from '../util.service';

import { ExcelService } from '../excel.service';
import { InvoiceEx } from '../invoice_ex';
import { ApiResponse } from '../api-response';

@Component({
  selector: 'app-invoice-all',
  templateUrl: './invoice-all.component.html',
  styleUrls: ['./invoice-all.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class InvoiceAllComponent implements OnInit {

  invoices: Invoice[];
  s_date = new Date();
  e_date = new Date();
  total = 0;
  errorResponse: ApiResponse;
  navigationSubscription;

  invoiceExs: InvoiceEx[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private unstoringService: UnstoringService,
    private utilService: UtilService,
    private excelService: ExcelService
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

    const s_day = this.s_date.getFullYear() + '-' +
      this.utilService.get2digits(this.s_date.getMonth() + 1) + '-' +
      this.utilService.get2digits(this.s_date.getDate());

    const e_day = this.e_date.getFullYear() + '-' +
      this.utilService.get2digits(this.e_date.getMonth() + 1) + '-' +
      this.utilService.get2digits(this.e_date.getDate());

    this.invoiceService.periodAll(s_day, e_day).
      then((data) => {
        this.invoices = data as Invoice[];
      })
      .catch(response => null);
  }

  getOutSum(invoice: string): number {

    let sum = 0;
    for (let i = 0; i < this.invoices.length; i++) {
      if (this.invoices[i].invoice === invoice) {
        for (let j = 0; j < this.invoices[i].unstoring.length; j++) {
          sum += this.invoices[i].unstoring[j].outSum;
        }
      }
    }
    return sum;
  }

  onModifySeller(invoice_id: string, invoice: Invoice, seller: number) {
    console.log(seller);

    invoice.seller_no = seller;
    this.invoiceService.update(invoice_id, invoice)
      .then(data => {
        // alert('삭제하였습니다.');
        this.router.navigate(['/invoice/all']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
  }

  onModifyOutNumber(unstoring_id: string, unstoring: Unstoring, value: number) {

    unstoring.outNumber = value;
    unstoring.outSum = unstoring.outNumber * unstoring.outPrice;
    this.unstoringService.update(unstoring_id, unstoring)
      .then(data => {
        // alert('삭제하였습니다.');
        this.router.navigate(['/invoice/all']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
  }

  onModifyOutPrice(unstoring_id: string, unstoring: Unstoring, value: number) {

    unstoring.outPrice = value;
    unstoring.outSum = unstoring.outNumber * unstoring.outPrice;
    this.unstoringService.update(unstoring_id, unstoring)
      .then(data => {
        // alert('삭제하였습니다.');
        this.router.navigate(['/invoice/all']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
  }

  deleteInvoice(id: string) {
    const answer = confirm('송품장을 삭제하시겠습니까?');
    if (answer) {
      this.invoiceService.destroy(id)
      .then(data => {
        alert('삭제하였습니다.');
        this.router.navigate(['/invoice/all']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
    }
  }

  exportAsXLSX(): void {
    this.makeExport();
    this.excelService.exportAsExcelFile(this.invoiceExs, 'invoice');
  }

  makeExport() {
    // console.log(this.invoices);
    const idx = 0;
    for (let i = 0; i < this.invoices.length; i++) {

      const invoiceEx = {} as InvoiceEx;

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
      invoiceEx.in_number = (this.invoices[i].in_number);
      invoiceEx.in_sum = (this.invoices[i].in_sum);
      invoiceEx.out_number = (this.invoices[i].out_number);
      invoiceEx.out_sum = (this.invoices[i].out_sum);

      invoiceEx.outDate = '';
      invoiceEx.outNumber = 0;
      invoiceEx.outSum = 0;
      invoiceEx.outPurchase = '';

      invoiceEx.seller_no = this.invoices[i].seller_no;

      this.invoiceExs.push(invoiceEx);

      for ( let j = 0; j < this.invoices[i].unstoring.length; j++) {

        const invoiceExOut = {} as InvoiceEx;

        invoiceExOut.trader = ''; // this.invoices[i].trader;
        invoiceExOut.in_out = '';  // this.invoices[i].in_out;
        invoiceExOut.in_date = ''; // this.invoices[i].in_date;
        invoiceExOut.seller = '';  // this.invoices[i].seller;
        invoiceExOut.deal_type = ''; // this.invoices[i].deal_type;
        invoiceExOut.invoice = ''; // this.invoices[i].invoice;
        invoiceExOut.origin = ''; // this.invoices[i].origin;
        invoiceExOut.item = '';  // this.invoices[i].item;
        invoiceExOut.unit = '';  // this.invoices[i].unit;
        invoiceExOut.quality = ''; // this.invoices[i].quality;
        invoiceExOut.weight = ''; // this.invoices[i].weight;
        invoiceExOut.in_number = 0;  // this.invoices[i].in_number;
        invoiceExOut.in_sum = 0; // this.invoices[i].in_sum;
        invoiceExOut.out_number = 0; // this.invoices[i].out_number;
        invoiceExOut.out_sum = 0;  // this.invoices[i].out_sum;

        invoiceExOut.outDate = this.invoices[i].unstoring[j].outDate;
        invoiceExOut.outNumber = this.invoices[i].unstoring[j].outNumber;
        invoiceExOut.outSum = this.invoices[i].unstoring[j].outSum;
        invoiceExOut.outPurchase = this.invoices[i].unstoring[j].outPurchase;

        invoiceExOut.seller_no = this.invoices[i].seller_no;

        this.invoiceExs.push(invoiceExOut);
      }
    }
  }

}

function addComma(num) {
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regexp, ',');
}
