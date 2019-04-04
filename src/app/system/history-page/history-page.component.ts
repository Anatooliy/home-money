import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment'

import { CategoriesService } from '../shared/services/categories.service';
import { EventService } from '../shared/services/events.service';
import { combineLatest, Subscription } from 'rxjs';
import { Category } from '../shared/models/category.model';
import { STSEvent } from '../shared/models/event.model';
import { BillService } from '../shared/services/bill.service';

@Component({
  selector: 'sts-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  isLoaded = false;
  subscr: Subscription;
  categories: Category[] = [];
  events: STSEvent[] = [];
  filteredEvents: STSEvent[] = [];
  curencyRubValue: number;

  chartData = [];

  isFilterVisivle = false;

  private setOriginalEvents(){
    this.filteredEvents = this.events.slice();
  }

  calculateChartData(): void{
    this.chartData = [];

    this.categories.forEach((cat) => {
      const catEvents = this.filteredEvents.filter((e) => e.category === cat.id && e.type === "outcome")
      this.chartData.push({
        name: cat.name,
        value: catEvents.reduce((total, e) => {
            total += e.amount;
            return total * this.curencyRubValue
          }, 0).toFixed(2)        
      });
    })   
  }

  private toogleFilterVisibility(dir: boolean){
    this.isFilterVisivle = dir;
  }

  openFilter(){
    this.toogleFilterVisibility(true);
  }

  constructor(
    private categoriesService: CategoriesService,
    private eventService: EventService,
    private billService: BillService
  ) { }

  onFilterApply(filterData){
    this.toogleFilterVisibility(false);
    this.setOriginalEvents();
    
    const startPerios = moment().startOf(filterData.period).startOf('d');
    const endPerios = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents
      .filter((e) => {
        return filterData.types.indexOf(e.type) !== -1;
      })
      .filter((e) => {
        return filterData.categories.indexOf(e.category.toString()) !== -1;
      })
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPerios, endPerios);
      });      
      this.calculateChartData();
  }

  onFilterCancel(){
    this.toogleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnInit() {
    this.subscr = combineLatest(
      this.categoriesService.getCategories(),
      this.eventService.getEvents(),
      this.billService.getCurrency()
    ).subscribe((data: [Category[], STSEvent[], any]) => {
      this.categories = data[0];
      this.events = data[1];
      this.curencyRubValue = data[2]['rates']['RUB'];

      this.setOriginalEvents();
      this.calculateChartData();

      this.isLoaded = true;
    })
  }

  ngOnDestroy(): void {    
    if(this.subscr){
      this.subscr.unsubscribe();
    }
  }
}
