import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
	name: 'safeCss'
})

export class SafeCss implements PipeTransform  {

	constructor(protected _sanitizer: DomSanitizer) {}

	public transform(value: string): SafeStyle  {
		return this._sanitizer.bypassSecurityTrustStyle(value);
	}
}