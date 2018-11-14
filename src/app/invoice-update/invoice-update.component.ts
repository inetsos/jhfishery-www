import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { Invoice } from '../invoice';
import { InvoiceSimple } from '../invoice-simple';
import { InvoiceService } from '../invoice.service';
import { Unstoring } from '../unstoring';
import { UnstoringService } from '../unstoring.service';
import { UtilService } from '../util.service';

import { ExcelService } from '../excel.service';
import { InvoiceEx } from '../invoice_ex';
import { ApiResponse } from '../api-response';

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.css']
})
export class InvoiceUpdateComponent implements OnInit {

  invoices: Invoice[];
  invoiceSimple: InvoiceSimple;
  invoice: Invoice;

  total = 0;
  invoice_no = '';
  errorResponse: ApiResponse;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private router: Router, private invoiceService: InvoiceService,
    private unstoringService: UnstoringService, private utilService: UtilService) {

    //   this.route.params.subscribe(params => {
    //     this.invoice_no = params['invoice'];
    //     console.log('1.', this.invoice_no);
    //     this.getInvoice(this.invoice_no);
    //  });
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.getInvoice(this.invoice_no);
        //   this.route.params.subscribe(params => {
        //     console.log('2.', this.invoice_no);
        //     this.invoice_no = params['invoice'];
        //  });
        }
      });
     }

  ngOnInit() {
  }

  getInvoice(invoice: string) {
    if (invoice !== '') {
      this.invoice_no = invoice;
      this.invoiceService.invoice(invoice).
        then((data) => {
          this.invoices = data as Invoice[];
        })
        .catch(response => null);
    }
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

    invoice.seller_no = seller;
    this.invoiceService.update(invoice_id, invoice)
      .then(data => {
        // alert('삭제하였습니다.');
        this.router.navigate(['/invoice/update'], { queryParams: { invoice: this.invoice_no } });
      })
      .catch(response => {
        this.errorResponse = response;
      });
  }

  onModifyOutNumber(invoice: Invoice, unstoring_id: string, unstoring: Unstoring, value: number) {
    this.invoice = invoice;
    unstoring.outNumber = value;
    unstoring.outSum = unstoring.outNumber * unstoring.outPrice;
    this.unstoringService.update(unstoring_id, unstoring)
      .then(data => {

        let out_number = 0;
        let out_sum = 0;
        const unstoring_old  = invoice.unstoring;
        for (let i = 0; i < unstoring_old.length; i++) {
          if (unstoring_old[i]._id !== data._id) {
            out_number += unstoring_old[i].outNumber;
            out_sum += unstoring_old[i].outSum;
          }
        }
        // this.updateData(data._id, out_number + data.outNumber, out_sum + data.outSum);
        invoice.out_number = out_number + data.outNumber;
        invoice.out_sum =  out_sum + data.outSum;
        this.invoiceService.update(invoice._id, invoice)
        .then(result => {
          this.router.navigate(['/invoice/update'], { queryParams: { invoice: this.invoice_no } });
        })
        .catch(response => {
          this.errorResponse = response;
        });
      })
      .catch(response => {
        this.errorResponse = response;
      });
  }

  onModifyOutPrice(invoice: Invoice, unstoring_id: string, unstoring: Unstoring, value: number) {

    unstoring.outPrice = value;
    unstoring.outSum = unstoring.outNumber * unstoring.outPrice;
    this.unstoringService.update(unstoring_id, unstoring)
      .then(data => {

        let out_number = 0;
        let out_sum = 0;
        const unstoring_old  = invoice.unstoring;
        for (let i = 0; i < unstoring_old.length; i++) {
          if (unstoring_old[i]._id !== data._id) {
            out_number += unstoring_old[i].outNumber;
            out_sum += unstoring_old[i].outSum;
          }
        }

        // this.updateData(data._id, out_number + data.outNumber, out_sum + data.outSum);
        invoice.out_number = out_number + data.outNumber;
        invoice.out_sum =  out_sum + data.outSum;
        this.invoiceService.update(invoice._id, invoice)
        .then(result => {
          this.router.navigate(['/invoice/update'], { queryParams: { invoice: this.invoice_no } });
        })
        .catch(response => {
          this.errorResponse = response;
        });

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


}
