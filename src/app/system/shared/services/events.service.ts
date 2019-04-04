import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { STSEvent } from '../models/event.model';
import { BaseApi } from 'src/app/shared/core/base-api';

@Injectable()
export class EventService extends BaseApi{
    constructor(http: Http){
        super(http);
    }

    addEvent(event: STSEvent): Observable<STSEvent>{
        return this.post('events', event);
    }

    getEvents(): Observable<STSEvent[]>{
        return this.get('events')
    }

    getEventById(id: string): Observable<STSEvent>{
        return this.get(`events/${id}`);
    }
}


