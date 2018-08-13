import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

//import { Company } from './data-model/company';



@Injectable()
export class GetDataService {

	constructor(private http: Http) { }

	getJSON(): Observable<any> {
    	return this.http.get("/assets/data/data.json").pipe(
    		tap(res => console.log('fetched heroes', res)),
        	map(res => res.json()),
        	//catchError(console.log("error getJSON()"))
      	);
  	};

}