import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'moneyConverter'
})
export class ConverterPipe implements PipeTransform{
    transform(value: number, currencyValue: number): number {
        return value * currencyValue
    }
}