import { Directive, ElementRef, Input, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare var hljs: any;

@Directive({
    selector: '[highlight-js-content]'
})
export class HighlightJsContentDirective implements OnInit, OnDestroy, AfterViewChecked {
    constructor(private elementRef: ElementRef) { }

    @Input() useBr: boolean;
    @Input('highlight-js-content') highlightSelector: string;

    private allowChange: boolean = true;
    private _subscription: Subscription | null;
    @Input()
    set changes(val: Observable<void> | null) {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
        if (val) {
            this._subscription = val.subscribe(() => this.allowChange = true);
        }
    }

    ngOnInit() {
        if (this.useBr) {
            hljs.configure({ useBR: true });
        }
    }
    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
    }

    ngAfterViewChecked() {
        let selector = this.highlightSelector || 'code';

        if (this.elementRef.nativeElement.innerHTML) {
            if (!this.allowChange) return;
            this.allowChange = false;

            let snippets = this.elementRef.nativeElement.querySelectorAll(selector);
            
            for(var snippet of snippets) {
                console.log("Updating highlights!");
                hljs.highlightBlock(snippet);
            } 
        }
    }
}
