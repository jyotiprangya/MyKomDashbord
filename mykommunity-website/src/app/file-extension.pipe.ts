import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileExtension'
})
export class FileExtensionPipe implements PipeTransform {

  transform(url: string): string {
    const parts = url.split('.');
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      const extension = lastPart.split('?')[0]; // Remove query parameters if any
      return extension.toLowerCase();
    }
    return '';
  }

}
