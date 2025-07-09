import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  private excludedFields = ['userRoleId', 'userId', 'updatedAt', 'profileImage', 'createdAt','isOwner'];

  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchTerm);
    });
  }
}

//   transform(value: any, filteredText:any){
//     if(!filteredText){
//       return value;
//     }

//     const readData = [];
//     for (const us of value){
//       if (us['firstName'] === filteredText) {
//         readData.push(us);
//       }
//     }
//     return readData;
//   }

// }

