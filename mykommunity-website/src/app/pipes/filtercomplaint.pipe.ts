import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtercomplaint'
})
export class FiltercomplaintPipe implements PipeTransform {

  private excludedFields = ['userId', 'societyId', 'rentalUnitId', 'blockId', 'floorId','image', 'complaintupdatedAt', 'complaintCreatedAt','categoryId'];

  transform(items: any[], searchComplaint: string): any[] {
    if (!items || !searchComplaint) {
      return items;
    }

    searchComplaint = searchComplaint.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchComplaint);
    });
  }
}

