import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable }   from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operators';

import { Chart } from 'chart.js';

//import { WeekStats } from './../data-model/data';
import { WeekStats } from '../data-model/data';
import { CurrentData } from '../data-model/data';
import { CalcSumVals } from '../data-model/data'; 
import { ChartLabel } from '../data-model/data';
import { FirstSelected } from '../data-model/data'; 


@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
	@Input() items;
	@Output() sendId = new EventEmitter<number>();	

	chart:any; // =[];

	// список категорий
	categoryList = [];
	// список компаний по категориям
	categoryItemList = [];

	weekStats:WeekStats = {
		monday: 0,
    	tuesday: 0,
    	wednesday: 0,
    	thursday: 0,
    	friday: 0,
    	saturday: 0,
    	sunday: 0,
	};
	calcSumVals = new CalcSumVals(0,0, this.weekStats);
	chartLabel = new ChartLabel();
	fS = new FirstSelected();

	currentData:CurrentData = {
		category: '',
    	item: {},
    	month: 0,
    	total: 0,
    	hiddenOpen: false
	};

	constructor() { }

	ngOnInit() {		
		this.filterItemVsCategory();
		//this.createChart(this.categoryItemList['все категории'][0]['chartArr']);
		this.createChart(this.categoryItemList[this.fS.allCategories][0]['chartArr']);
	}

	
	filterItemVsCategory() {

		//let o = {'все категории':''}; //объект категорий
		let o = {};
		o[this.fS.allCategories] = '';
		let catInit:string;

		this.items.forEach((element) => {			
			o[element.category] = '';
		});
		
		for (let key in o) {
 
			if (key == this.fS.allCategories) {
				this.categoryItemList[key] = this.items.slice();				
			}
			else {
				this.categoryItemList[key] = this.items.filter(x => x.category == key);					
			}

			this.categoryItemList[key].unshift({ 'category': key, 'name': this.fS.allEntries });
		}

		for (let key in o) {	

			this.calcSumVals.setZero();

			let result = this.categoryItemList[key].reduce((sum, current) => {			
				
				if (current.name != this.fS.allEntries) {

					for (let key in current.weekStats) {
						sum.weekStats[key] += current.weekStats[key];
					}

					sum.balance += current.balance;
					sum.monthBalance += current.monthBalance;
				}

				return sum;

			}, this.calcSumVals); 

			
			this.categoryItemList[key][0]['chartArr'] = (Object.values(result.weekStats)).slice();
			this.categoryItemList[key][0]['balance'] = result.balance;
			this.categoryItemList[key][0]['monthBalance'] = result.monthBalance;
		}
		

		this.categoryList = Object.keys(o);
				
		// chart initial data
		catInit = this.categoryList[0];
		this.currentData.item = this.categoryItemList[catInit][0];
		this.currentData.category = catInit;

		this.currentData.month = this.categoryItemList[catInit][0].monthBalance;
		this.currentData.total = this.categoryItemList[catInit][0].balance;			
		
		//console.log("массив с категориями" , this.categoryList);
		console.log("фильтр по категориям, суммы " , this.categoryItemList );
		//console.log("текущие данные currentData" , this.currentData);		
	}	

	createChart(data) {
		this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.chartLabel.x,
            datasets: [
              { 
                data: data,
                borderColor: "#3cba9f",
                fill: false
              }             
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });	
	}

	updateChart(data) {
		this.chart.data.datasets[0].data = data.slice();
		this.chart.update();	
	}

	onCategorySelect(event) {

		let cat = event.target.value;

		this.currentData.item = this.categoryItemList[cat][0]; // object assign ?
		this.currentData.category = cat;
		this.currentData.month = this.categoryItemList[cat][0].monthBalance;
		this.currentData.total = this.categoryItemList[cat][0].balance;
		this.currentData.hiddenOpen = false;

		this.updateChart( (this.categoryItemList[cat][0].chartArr) ); //.slice()

	}

	onItemSelect(event) {

		let item = this.currentData.item;

		this.currentData.month = item.monthBalance;
		this.currentData.total = item.balance;

		if (item.chartArr != undefined) {
			this.updateChart( item.chartArr );
			this.currentData.hiddenOpen = false;
		}
		else {
			this.updateChart( Object.values(item.weekStats) ); //.slice()
			this.currentData.hiddenOpen = true;	
		}		
	}	

	onOpenClick() {
		let id = this.currentData.item.id;
		this.sendId.emit(id);
	}



	/*onCategorySelect2(event) {
		console.log("выбранная категория", event.target.value);
		let c = event.target.value;	
		let o = {
			monday: 0,
    		tuesday: 0,
    		wednesday: 0,
    		thursday: 0,
    		friday: 0,
    		saturday: 0,
    		sunday: 0
		}
		// сложение в рамках одной категории
		this.items.forEach((element) => {

			if (element.category == c) {

				for (let key in element.weekStats) {
					console.log("key ", key);
					o[key] += element.weekStats[key];

				}
			}
		});
		let labelArr = (Object.keys(o)).map((e:string) => (e.charAt(0)).toUpperCase());		
	}

	customObservable() {
		const el = document.getElementById('selectCategory');
		const source = fromEvent(el, 'change');
		const example = source.pipe(map((event:any) => `Event value: ${event.target.value}`));
		const subscribe = example.subscribe(val => console.log(val));
	}
	*/

}

