import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment'

@Pipe({
    name: 'stsMoment'
})
export class MomentPipe implements PipeTransform{
    transform(value: string, formatFrom: string, formatTo: string = 'MM/DD/YYYY'): string {
        return moment(value, formatFrom).format(formatTo);
    }

}
