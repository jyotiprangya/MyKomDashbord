import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shift'
})
export class ShiftPipe implements PipeTransform {

  private excludedFields = ['id', 'updatedAt', 'createdAt'];

  transform(items: any[], searchShift: string): any[] {
    if (!items || !searchShift) {
      return items;
    }
    searchShift = searchShift.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchShift);
    });
  }
}



