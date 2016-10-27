
// This service handles information shared between the different components when editing datums.

// It would have been easier to do this using @Input, but that made the iframe reload every time the user selected a datum.  This is kind of a workaround.
// See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service


import { Injectable } from '@angular/core';

import { Subject }    from 'rxjs/Subject';

import { Datum } from './datum';

@Injectable()
export class DatumEditService {

    // Currently selected datum
    private selectedDatum: Datum;

    // Event stream for selected datum, an event is fired every time a new datum is selected.
    private datumSelectSource = new Subject<Datum>();
    
    // Outside classes can subscribe to this event stream, but since it's an observable and not a subject, events can only be fired from inside this class.
    datumSelectSource$ = this.datumSelectSource.asObservable();
    
    // Update the currently selected datum, and fire an event showing that the datum has changed
    selectDatum(datum: Datum): void {
        this.selectedDatum = datum;
        this.datumSelectSource.next(datum);
    }
    
    
    
    
    
    // Event stream for highlight mode, an event is fired every time the highlight mode is toggled.
    private highlightModeSource = new Subject<string>();
    
    highlightModeSource$ = this.highlightModeSource.asObservable();
    
    setHighlightMode(mode: string): void {
        this.highlightModeSource.next(mode);
    }
    
}
