import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'unixtime',
    standalone: true
})
export class UnixTimePipe implements PipeTransform {
    transform(value: any, params: any[] = []) {
        if (typeof (value) === 'number') {
            return moment.unix(value).format(params.length > 0 ? params[0] : 'DD/MM/YYYY');
        } else {
            return value;
        }
    }
}
