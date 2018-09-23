import { Component, OnInit } from '@angular/core';

import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:3300/api/upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  public uploader:FileUploader = new FileUploader({url: URL, itemAlias: 'excel'});

  constructor() { }

  ngOnInit() {
    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
         console.log("Excel File Upload : uploaded:", item, status, response);
         alert('송품장을 업로드하였습니다.');
     };
  }

}
