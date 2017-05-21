import { Directive, ElementRef, Input, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare var hljs: any;

@Directive({
    selector: '[highlight-js-content]'
})
export class HighlightJsContentDirective implements OnInit, AfterViewChecked {
    constructor(private elementRef: ElementRef) { }

    @Input() useBr: boolean;
    @Input('highlight-js-content') highlightSelector: string;
    private previousInnerHtml: string | null = null;

    ngOnInit() {
        if (this.useBr) {
            hljs.configure({ useBR: true });
        }
    }

    ngAfterViewChecked() {
        let selector = this.highlightSelector || 'code';

        let innerHtml = this.elementRef.nativeElement.innerHTML;
        if (innerHtml === this.previousInnerHtml) return;
        this.previousInnerHtml = innerHtml;

        if (innerHtml) {
            let snippets = this.elementRef.nativeElement.querySelectorAll(selector);

            for(var snippet of snippets) {
                hljs.highlightBlock(snippet);
            }

            innerHtml = this.elementRef.nativeElement.innerHTML;
            this.previousInnerHtml = innerHtml;
        }
    }
}
