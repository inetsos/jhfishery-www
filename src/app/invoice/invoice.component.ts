import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
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
  s_date = new Date();
  e_date = new Date();
  total = 0;
  errorResponse: ApiResponse;
  navigationSubscription;

  invoiceExs: InvoiceEx[] = [];

  promises = [];
  checkedInvoice = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
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

  selectAll() {
    for (let i = 0; i < this.invoices.length; i++) {
      this.checkedInvoice[i] = this.invoices[i]._id;
    }
  }

  onChange(isChecked: boolean, i: number, id: string) {
    if (isChecked === true) {
      this.checkedInvoice[i] = id;
    } else {
      this.checkedInvoice[i] = '';
    }

    console.log(this.checkedInvoice);
  }

  anotherDay() {

    const s_day = this.s_date.getFullYear() + '-' +
      this.utilService.get2digits(this.s_date.getMonth() + 1) + '-' +
      this.utilService.get2digits(this.s_date.getDate());

    const e_day = this.e_date.getFullYear() + '-' +
      this.utilService.get2digits(this.e_date.getMonth() + 1) + '-' +
      this.utilService.get2digits(this.e_date.getDate());


    this.invoiceService.period(s_day, e_day).
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

//   var family = ['Shane', 'Sally', 'Isaac'];
// console.log(family.indexOf('Isaac'); // 2
// console.log(family.indexOf('Kittie'); // -1
// var kittieExists = family.indexOf('Kittie') > -1; // false
// if (!kittieExists) {
//   family.push('Kittie');
// }
// console.log(family); // 'Shane', 'Sally', 'Isaac', 'Kittie'];

  deleteCheckedInvoice() {
    for (let i = 0; i < this.checkedInvoice.length ; i++) {
      if (this.checkedInvoice[i] !== '') {
        this.promises.push(checkValue(this.checkedInvoice[i]));
      }
    }

   Promise.all(this.promises)
    .then(function(data) {
      this.router.navigate(['/invoice']);
    })
    .catch(function(err) {
      this.errorResponse = err;
    });

  function checkValue(id: string) {
      return new Promise(function(resolve, reject) {
            this.invoiceService.destroy(id)
            .then(data => {
              return resolve(data);
            })
            .catch(response => {
              return reject(response);
            });
      });
    }
  }

  deleteInvoice(id: string) {
    const answer = confirm('송품장을 삭제하시겠습니까?');
    if (answer) {
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

  exportAsXLSX(): void {
    this.makeExport();
    this.excelService.exportAsExcelFile(this.invoiceExs, 'invoice');
  }

  makeExport() {
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
      invoiceEx.in_number = this.invoices[i].in_number;
      invoiceEx.in_sum = (this.invoices[i].in_sum);
      invoiceEx.out_number = (this.invoices[i].out_number);
      invoiceEx.out_sum = (this.invoices[i].out_sum);

      invoiceEx.outDate = '';
      invoiceEx.outNumber = 0;
      invoiceEx.outSum = 0;
      invoiceEx.outPurchase = '';

      invoiceEx.seller_no = this.invoices[i].seller_no;

      this.invoiceExs.push(invoiceEx);

      for (let j = 0; j < this.invoices[i].unstoring.length; j++) {

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
        invoiceExOut.outNumber = (this.invoices[i].unstoring[j].outNumber);
        invoiceExOut.outSum = (this.invoices[i].unstoring[j].outSum);
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
