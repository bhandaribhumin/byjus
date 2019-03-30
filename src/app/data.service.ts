import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: any = [];
  api_url = 'https://api.myjson.com/bins/1fq8pm';
  private records = new Subject<any>();
  constructor(private _http: HttpClient) {
    this._http.get(this.api_url).subscribe( res => {
      this.data = res;
      this.data.forEach(element => {
        element.searchTerm = `${element['Course Name']} ${element['Parent Subject']} ${element['Child Subject']}`;
        if (!element[`Next Session Date`].length || element[`Next Session Date`] === 'NA' ||
        element[`Next Session Date`] === 'Self paced') {
          element.timeStamp = moment().valueOf() || 0;
        } else {
          element.timeStamp = moment(element[`Next Session Date`]).valueOf() ||
          moment(element[`Next Session Date`], 'Do MMM, YYYY').valueOf();
        }
      });
      console.log(this.data);
      this.records.next(this.data);
    });
  }
  getMessage(): Observable<any> {
    return this.records.asObservable();
  }

}
