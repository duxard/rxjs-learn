import {Observable, fromEvent, timer, interval, of } from "rxjs";
import cl from "./print";
import { fromPromise } from "rxjs/internal-compatibility";
import {filter, finalize, map, subscribeOn, tap, throttle} from "rxjs/operators";

/**
 1 variant
*/
const obs = new Observable((observer: any) => {
    observer.next('Hi all!');
    observer.next('Here we go!');
    observer.complete();
});

obs.subscribe((data:any) => {
    cl(data);
    }, (err: any) => {
        cl(err);
    }, () => {
        cl('complete');
  }
);

/**
 2 variant - fromEvent
 */
const clicks = fromEvent(document, 'click');
clicks.subscribe(click => cl(click));

/**
 3 variant - promise
 */
const promise = new Promise(resolve => setTimeout(() => {
    resolve('success!');
}, 1500));

const obsPromise = fromPromise(promise);
obsPromise.subscribe((data) => cl(data));

/**
 4 variant - timer + piping
 */
const myTimer = timer(1000);
myTimer
  .pipe(finalize(() => cl('Sequence complete')))
  .subscribe(() => cl('myTimer done'));

/**
 5 variant - interval
 */
const intv = interval(1000);
const intvSubscription = intv.subscribe(() => cl( new Date().getSeconds() ));
setTimeout(() => {
    intvSubscription.unsubscribe();
}, 3000);

/**
 6 variant - of() usage
 */
const items = of(100, 'string', [1,2,3], {x: 111});
items.subscribe((data) => cl(data));

/**
 7 variant - cold observable - the observable where the data is created inside of it
 */

const cold = new Observable((obsv: any) => {
    obsv.next( Math.random() );
});
cold.subscribe(a => cl(a));
cold.subscribe(b => cl(b));

/**
 8 variant - hot observable - the data is generated outside observable
 */
// TODO

/**
 9 variant - map() operator
 */
const numbers_a = of(1,2,3);
numbers_a
  .pipe(
    tap(() => cl('before map()')),
    map(item => item*10),
    tap(() => cl('after map()'))
  )
  .subscribe(receivedFromPipe => cl(receivedFromPipe));

/**
 10 variant - filter() operator - you give it a condition and only values meeting that condition make it through
 */
const numbers_b = of(-1,2,-3,4,-5);
numbers_b
  .pipe(
    filter(num => num>0)
  )
  .subscribe(receivedFromPipe => cl(receivedFromPipe));

/**
 11 variant - throttling
 */
const mouseEvent = fromEvent(document, 'mousemove');
mouseEvent
  .pipe(
    throttle(() => interval(1000))
  )
  .subscribe(() => cl('mouse moving'));
