import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'security'
})
export class SecurityPipe implements PipeTransform {
  private excludedFields = ['userRoleId', 'userId', 'updatedAt', 'profileImage', 'createdAt','isOwner'];

  transform(items: any[], searchSecurity: string): any[] {
    if (!items || !searchSecurity) {
      return items;
    }
    searchSecurity = searchSecurity.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchSecurity);
    });
  }
}



