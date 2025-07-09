import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filteramenity'
})
export class FilteramenityPipe implements PipeTransform {

  private excludedFields = ['userprofileImage', 'userId', 'startTime', 'rentalUnitId', 'floorId','id', 'endTime'];

  transform(items: any[], searchAmenity: string): any[] {
    if (!items || !searchAmenity) {
      return items;
    }

    searchAmenity = searchAmenity.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchAmenity);
    });
  }
}
