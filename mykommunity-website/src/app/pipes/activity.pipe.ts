import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activity'
})
export class ActivityPipe implements PipeTransform {
  private excludedFields = ['approvedFrom', 'visitorId', 'updatedAt', 'societyId', 'createdAt','image', 'imageUrl', 'leaveParcelAtGate', 'isWearingMask', 'approvedTill'];

  transform(items: any[], searchActivity: string): any[] {
    if (!items || !searchActivity) {
      return items;
    }

    searchActivity = searchActivity.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchActivity);
    });
  }
}
