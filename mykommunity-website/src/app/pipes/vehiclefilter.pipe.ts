import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehiclefilter'
})
export class VehiclefilterPipe implements PipeTransform {

  private excludedFields = ['id', 'userId', 'updatedAt', 'userprofileImage', 'createdAt','rentalUnitId','image'];

  transform(items: any[], searchVehicle: string): any[] {
    if (!items || !searchVehicle) {
      return items;
    }
    searchVehicle = searchVehicle.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
      
  
      return concatenatedValues.includes(searchVehicle);
    });
  }
}

