import { Http, Response } from '@angular/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model'
import { BaseApi } from '../core/base-api';

@Injectable()
export class UsersService extends BaseApi{
    constructor(public http: Http){
        super(http);
    }

    // getUserByEmail(email: string): Observable<User>{
    //     return this.http.get(`//localhost:3000/users?email=${ email }`).pipe(
    //         map((response: Response) => { return response.json() }),
    //         map((user: User[]) => { 
    //             if(user[0]){ 
    //                 return user[0]
    //             }  
    //             else{
    //                 return undefined;
    //             } 
    //         })
    //     )
    // }

    getUserByEmail(email: string): Observable<User>{
        return this.get(`users?email=${ email }`)
            .pipe(
                map((user: User[]) => { 
                    if(user[0]){ 
                        return user[0]
                    }  
                    else{
                        return undefined;
                    } 
                })
            );
    }

    // createNewUser(user: User): Observable<User>{
    //     return this.http.post(`//localhost:3000/users`, user).pipe(
    //         map((response: Response) => { return response.json()} )
    //     );
    // }

    createNewUser(user: User): Observable<User>{
        return this.post(`users`, user);
    }
}