export class AlterName {
    readonly type = 'category';
    readonly revenuePerWeek = 'weekStats';
    readonly revenue = 'balance';
    readonly monthRevenue = 'monthBalance';
}

export interface WeekStats {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number
};

//export const CHART_X_LABEL = (Object.keys(this.WeekStats)).map((e:string) => (e.charAt(0)).toUpperCase());
export class ChartLabel {
    readonly x = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
}

export class FirstSelected {
    readonly allCategories = 'все категории';
    readonly allEntries = 'все вхождения'
}

export class CalcSumVals {
    constructor(
        public balance:number, 
        public monthBalance:number,
        public weekStats: {
            monday: number;
            tuesday: number;
            wednesday: number;
            thursday: number;
            friday: number;
            saturday: number;
            sunday: number
        }
    ) {}

    setZero() {
        Object.keys(this).forEach((key)=> {

            if ( typeof(this[key]) != 'object') {
                this[key] = 0; 
            }
            else {
                for (let k in this[key]) {
                    this[key][k] = 0; 
                }  
            }            
        });
    }
}

export interface CurrentData {
    category:string;
    item:any;
    month:number;
    total:number;
    hiddenOpen:boolean;
};
export class Company {
    id: number;
      name: string;
    type: string;
    revenuePerWeek: {
            monday: number;
            tuesday: number;
            wednesday: number;
            thursday: number;
            friday: number;
            saturday: number;
            sunday: number
        };
    revenue: number;
    monthRevenue: number
}
