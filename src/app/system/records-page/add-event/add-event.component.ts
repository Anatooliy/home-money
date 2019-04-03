import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

import { STSEvent } from '../../shared/models/event.model';
import { Category } from '../../shared/models/category.model';
import { EventService } from '../../shared/services/events.service';
import { BillService } from '../../shared/services/bill.service';
import { Bill } from '../../shared/models/bill.model';
import { mergeMap } from 'rxjs/operators';
import { Message } from 'src/app/shared/models/message.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'sts-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if(this.sub1){
      this.sub1.unsubscribe();
    }

    if(this.sub2){
      this.sub2.unsubscribe();
    }
  }

  sub1: Subscription;
  sub2: Subscription;

  @Input() categories: Category[] = [];
  types = [
    {type: 'income', label: 'Income'},
    {type: 'outcome', label: 'Outcome'}
  ]

  message: Message;

  constructor(
    private eventService: EventService, 
    private billService: BillService) { }

  ngOnInit() {
    this.message = new Message('danger', '')
  }

  private showMessage(text: string){
    this.message.text = text;
    window.setTimeout(() => { this.message.text = ''}, 5000);
  }

  onSubmit(form: NgForm){
    let {amount, description, category, type} = form.value;
    
    if(amount < 0){
      amount *= -1;
    }

    const event = new STSEvent(
      type, 
      amount, 
      +category,  
      moment().format('MM/DD/YYYY HH:mm:ss'), 
      description
    );

    this.sub1 = this.billService.getBill()
      .subscribe((bill: Bill) => {
        let value = 0;
        if(type === 'outcome'){
          if(amount > bill.value){
            this.showMessage(`There is not enough money in the account. You need ${amount - bill.value}`)
            return;
          }
          else{
            value = bill.value - amount;
          }
        }
        else{
          value = bill.value + amount;
        }

        this.sub2 = this.billService.updateBill({value, currency: bill.currency}).pipe(
          mergeMap(() => this.eventService.addEvent(event))
        ).subscribe(() => {
          form.setValue({
            amount: 0,
            description: ' ',
            category: 1,
            type: 'outcome'
          })
        });
      });
  }
}
