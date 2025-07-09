import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flatfilter'
})
export class FlatfilterPipe implements PipeTransform {

  private excludedFields = ['id', 'floorId', 'blockId', 'updatedAt', 'createdAt'];

  transform(items: any[], searchFlat: string): any[] {
    if (!items || !searchFlat) {
      return items;
    }

    searchFlat = searchFlat.toLowerCase(); // Convert the search term to lowercase for case-insensitive search

    return items.filter(item => {
      // Modify the logic based on your table structure and filter requirements
      let concatenatedValues = '';

      for (const key in item) {
        if (item.hasOwnProperty(key) && !this.excludedFields.includes(key) && typeof item[key] === 'string') {
          concatenatedValues += item[key].toLowerCase();
        }
      }
  
      return concatenatedValues.includes(searchFlat);
    });
  }
}






// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'flatfilter'
// })
// export class FlatfilterPipe implements PipeTransform {

//   transform(items: any[], searchFlat: string): any[] {
//     if (!items || !searchFlat) {
//       return items;
//     }

//     searchFlat = searchFlat;
//     return items.filter(item => {
//       // Modify the logic based on your table structure and filter requirements
//       let concatenatedValues = '';

//       for (const key in item) {
//         if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
//           concatenatedValues += item[key].toLowerCase();
//         }
//       }
  
//       return concatenatedValues.includes(searchFlat);
//     });
//   }
// }

