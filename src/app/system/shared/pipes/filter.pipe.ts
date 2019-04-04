import { Pipe, PipeTransform } from "@angular/core";
import { MomentPipe } from './moment.pipe';
import { ConverterPipe } from './converter';

@Pipe({
    name: 'stsFilter'
})
export class FilterPipe implements PipeTransform{
    transform(items: any, value: string, field: string, currencyRubValue: number): any {
        if(items.length === 0 || ! value){
            return items;
        }        

        return items.filter((i) => {    
            const t = Object.assign({}, i);            

            if(!isNaN(t[field])){
                t[field] = new ConverterPipe()
                    .transform(t[field], currencyRubValue)
                    .toFixed(2)
                    .toString();
            }
                
            if(field === 'category'){
                t[field] = t['catName'];
            }

            if(field === 'date'){
                t[field] = new MomentPipe( ).transform(t[field], "DD.MM.YYYY HH.mm.ss");
            }            

            return t[field].toLowerCase().indexOf(value.toLowerCase()) !== -1;            
        })
    }

}