import { Component, OnInit, OnDestroy } from '@angular/core';
import { BillService } from '../shared/services/bill.service';
import { CategoriesService } from '../shared/services/categories.service';
import { EventService } from '../shared/services/events.service';
import { combineLatest, Subscription } from 'rxjs';
import { Bill } from '../shared/models/bill.model';
import { Category } from '../shared/models/category.model';
import { STSEvent } from '../shared/models/event.model';

@Component({
  selector: 'sts-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {
  isLoaded = false;
  bill: Bill;
  categories: Category[] = [];
  events: STSEvent[] = [];
  subscr: Subscription;
  rub: number;
  curencyRubVal: number;
  
  constructor(
    private billService: BillService,
    private categoryService: CategoriesService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.subscr = combineLatest(
      this.billService.getBill(),      
      this.categoryService.getCategories(),
      this.eventService.getEvents(),
      this.billService.getCurrency()
    ).subscribe((data: [Bill, Category[], STSEvent[], any]) => {
        this.bill = data[0];
        this.categories = data[1];
        this.events = data[2];
        this.curencyRubVal = data[3]['rates']['RUB'];
        
        this.isLoaded = true;
    });    
  }

  getCategoryCost(cat: Category): number{
    const catEvents = this.events.filter(e => e.category === cat.id && e.type ==='outcome')
    return catEvents.reduce((total, e) => {
      total += e.amount;
      return total
    }, 0);
  }

  private getPercent(cat: Category): number{
    const percent = (100 * this.getCategoryCost(cat)) / cat.capacity;
    return percent > 100 ? 100 : percent;
  }

  getCatPercent(cat: Category):string{
    return this.getPercent(cat) + '%';
  }

  getCatColorClass(cat: Category): string{
    const percent = this.getPercent(cat);
    return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';     
  }

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe();
    }
  }

}
