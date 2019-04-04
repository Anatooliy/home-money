import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { EventService } from '../../shared/services/events.service';
import { CategoriesService } from '../../shared/services/categories.service';
import { mergeMap } from 'rxjs/operators';
import { STSEvent } from '../../shared/models/event.model';
import { Category } from '../../shared/models/category.model';
import { BillService } from '../../shared/services/bill.service';

@Component({
  selector: 'sts-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {
  
  subscr: Subscription;
  event: STSEvent;
  category: Category;
  isLoadet = false;
  currencyRubValue: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryservice: CategoriesService,
    private billService: BillService
  ) { }

  ngOnInit() {
    this.subscr = combineLatest(this.route.params
    .pipe(
      mergeMap((params:Params) => this.eventService.getEventById(params['id'])),
      mergeMap((event: STSEvent) =>  {
        this.event = event;        
        return this.categoryservice.getCategoryById(event.category)
      })     
    ),
    this.billService.getCurrency()
    )
    .subscribe((data:[Category, any]) => {
      this.category = data[0]; 
      this.currencyRubValue = data[1]['rates']['RUB'];     
      this.isLoadet = true; 
    })
  }

  ngOnDestroy(): void {
    if(this.subscr){
      this.subscr.unsubscribe();
    }
  }  
}
