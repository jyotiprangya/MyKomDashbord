import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dailyhelp'
})
export class DailyhelpPipe implements PipeTransform {
  private excludedFields = ['categoryId', 'id', 'updatedAt', 'isInside','image', ];

  transform(items: any[], searchDailyhelp: string): any[] {
    if (!items || !searchDailyhelp) {
      return items;
    }

    searchDailyhelp = searchDailyhelp.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchDailyhelp);
    });
  }
}

