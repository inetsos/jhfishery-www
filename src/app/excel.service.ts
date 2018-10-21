import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    // K, L, M, N, O, Q, R
    const K = XLSX.utils.decode_col('K');
    const L = XLSX.utils.decode_col('L');
    const M = XLSX.utils.decode_col('M');
    const N = XLSX.utils.decode_col('N');
    const O = XLSX.utils.decode_col('O');
    const Q = XLSX.utils.decode_col('Q');
    const R = XLSX.utils.decode_col('R');

    const fmt = '#,##0';  // .00_);[Red]\\("$"#,##0.00\\)' or any Excel number format

    /* get worksheet range */
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let i = range.s.r + 1; i <= range.e.r; ++i) {
      /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
      let ref = XLSX.utils.encode_cell({r: i, c: K});
      /* if the particular row did not contain data for the column, the cell will not be generated */
      if (!worksheet[ref]) {
        continue;
      }
      /* `.t == "n"` for number cells */
      // if(ws[ref].t != 'n') continue;
      /* assign the `.z` number format */
      worksheet[ref].z = fmt;

      ref = XLSX.utils.encode_cell({r: i, c: L});
      if (!worksheet[ref]) {
        continue;
      }
      worksheet[ref].z = fmt;

      ref = XLSX.utils.encode_cell({r: i, c: M});
      if (!worksheet[ref]) {
        continue;
      }
      worksheet[ref].z = fmt;

      ref = XLSX.utils.encode_cell({r: i, c: N});
      if (!worksheet[ref]) {
        continue;
      }
      worksheet[ref].z = fmt;

      ref = XLSX.utils.encode_cell({r: i, c: O});
      if (!worksheet[ref]) {
        continue;
      }
      worksheet[ref].z = fmt;

      ref = XLSX.utils.encode_cell({r: i, c: Q});
      if (!worksheet[ref]) {
        continue;
      }
      worksheet[ref].z = fmt;

      ref = XLSX.utils.encode_cell({r: i, c: R});
      if (!worksheet[ref]) {
        continue;
      }
      worksheet[ref].z = fmt;
    }

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
