import { Component, OnInit } from '@angular/core';
import { Observable }     from 'rxjs/Observable';

import { Company } from './data-model/data';
import { AlterName } from './data-model/data';
import { GetDataService } from './get-data.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {

    companies:Company[];
    alterName = new AlterName();
    id:number;

    constructor(private getDataService: GetDataService) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
	    this.getDataService.getJSON().subscribe(
            data => { 
              console.log("data initial", data);
              this.dumbDataPrepare(data.companies);
        });
    }

    dumbDataPrepare(arr) {

        let result = [];
        arr.forEach((element) => {

            let o = {};

            if (element.monthRevenue > 0) {
                for (let key in element) {

                    let n = this.checkAlterName(key);                    

                    if (key == 'revenuePerWeek') {
                        o[n] = Object.assign({}, element[key]);
                    }
                    else {
                        o[n] = element[key];   
                    } 
                }
                result.push(o);
            }            
        });

        this.companies = result.slice();
        //console.log("this.companies", this.companies);
    }

    checkAlterName(key) { 
        if (this.alterName[key] != undefined) {
            return this.alterName[key];
        }
        else {
          return key;
        }
    }

    getId(id) {
        console.log("id ", id);
        this.id = id;
    }

}
