import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'byjus';
  isCollapsed = false;
  isReverseArrow = false;
  width = 200;
  listOfSearchName: string[] = [];
  listOfSearchAddress: string[] = [];
  listOfFilterName = [];
  listOfFilterAddress = [];
  listOfData: any = [
  ];
  Isloading = true;
  listOfDisplayData = [...this.listOfData];
  mapOfSort: { [key: string]: any } = {
    'Course Name': null,
    'Parent Subject': null,
    'Child Subject': null,
    'Provider': null,
    'Next Session Date': null
  };
  sortName: string | null = null;
  sortValue: string | null = null;
  totalEntries: any;
  subscription: any;
  searchTerm: any;
  listOfNameChild = [];
  listOfFilterChild = [];

  constructor(private dataService: DataService) {

  }
  ngOnInit() {
    this.subscription = this.dataService.getMessage().subscribe(data => {
      if (data) {
        this.listOfData = data;
        this.listOfDisplayData = [...data];
        this.listOfFilterChild = _.uniqBy(_.compact(this.listOfData.map(entry => {
          if (entry['Child Subject'] && entry['Child Subject'].length) {
            return {
              text: entry['Child Subject'],
              value: entry['Child Subject']
            };
          }
        })), 'value');
        this.totalEntries = data.length;
        this.Isloading = false;
        console.log(this.totalEntries);
      }

    });
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.mapOfSort) {
      if (this.mapOfSort.hasOwnProperty(key)) {
        this.mapOfSort[key] = key === sortName ? value : null;
      }
    }
    this.search(this.listOfNameChild);
  }


  search(listOfNameChild: string[]): void {
    this.listOfNameChild = listOfNameChild;
    const filterFunc = (item: any) =>
      (this.listOfNameChild.length ? this.listOfNameChild.some(name => item['Child Subject'].indexOf(name) !== -1) : true);
    const listOfData = this.listOfData.filter((item: any) => filterFunc(item));
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = listOfData.sort((a, b) => {
        if (this.sortName === 'Next Session Date') {
          if (this.sortValue === 'ascend') {
            return b.timeStamp - a.timeStamp;
          } else {
            return a.timeStamp - b.timeStamp;
          }
        }
        return this.sortValue === 'ascend'
          // tslint:disable-next-line:no-non-null-assertion
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          // tslint:disable-next-line:no-non-null-assertion
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1;
      }
      );
    } else {
      this.listOfDisplayData = listOfData;
    }
  }

  resetFilters(): void {
    this.listOfNameChild = [];
    this.search(this.listOfNameChild);
  }

  resetSortAndFilters(): void {
    this.sortName = null;
    this.sortValue = null;
    this.mapOfSort = {
      name: null,
      age: null,
      address: null
    };
    this.resetFilters();
    this.search(this.listOfNameChild);
  }
}
