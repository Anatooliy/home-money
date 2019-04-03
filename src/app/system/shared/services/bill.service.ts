import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';
import { map } from 'rxjs/operators';
import { BaseApi } from 'src/app/shared/core/base-api';

@Injectable()
export class BillService extends BaseApi{
    constructor(public http: Http){
        super(http);
    }

    getBill(): Observable<Bill>{
        return this.get('bill');
    }

    updateBill(bill: Bill): Observable<Bill>{
        return this.put('bill', bill)
    }

    getCurrency(base: string = 'EUR'): Observable<any>{
        return this.http.get(`http://data.fixer.io/api/latest?access_key=c257c695ff1a403e1399ef627d39331a&base=${base}`).pipe(
            map((response: Response) => {
                return response.json()
            })
        )
    }
}