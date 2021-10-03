import { Subject, AsyncSubject, BehaviorSubject, ReplaySubject, Observable, interval, concat, combineLatest, of, zip, range } from "rxjs";
import { mergeMap, delay, takeUntil, take, map, startWith, withLatestFrom, repeat, share, scan, skip } from "rxjs/operators";

const f = (p: string): string => {
  console.info(p + " printed");
  return "apa";
};

const weird = (): number => (
  //(const q = "abcd",
  console.info("zzz"), 5
);

const testRxjs = async () => {
  const subject = new Subject<string>();
  const asyncSubject = new AsyncSubject();
  const behaviorSubject = new BehaviorSubject("a");
  const replaySubject = new ReplaySubject(2);

  const subjects = [subject, asyncSubject, behaviorSubject, replaySubject];
  const log = (subjectType) => (e) => console.log(`${subjectType}: ${e}`);

  console.log("SUBSCRIBE 1");
  subject.subscribe(log("s1 subject"));
  asyncSubject.subscribe(log("s1 asyncSubject"));
  behaviorSubject.subscribe(log("s1 behaviorSubject"));
  replaySubject.subscribe(log("s1 replaySubject"));

  console.log("\nNEXT(r)");
  subjects.forEach((o) => o.next("r"));

  console.log("\nNEXT(x)");
  subjects.forEach((o) => o.next("x"));

  console.log("\nSUBSCRIBE 2");
  subject.subscribe(log("s2 subject"));
  asyncSubject.subscribe(log("s2 asyncSubject"));
  behaviorSubject.subscribe(log("s2 behaviorSubject"));
  replaySubject.subscribe(log("s2 replaySubject"));

  console.log("\nNEXT(j)");
  subjects.forEach((o) => o.next("j"));

  ///
  subject.next("delayed");

  const delyd = subject.pipe(delay(1000));
  delyd.subscribe(log("delayd"));
  subject.next("delayed2");
  //

  // console.log('\nCOMPLETE');
  // subjects.forEach(o => o.complete());

  // console.log('\nNEXT(s)');
  // subjects.forEach(o => o.next('s'));

  console.info("done");

  //
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.info("done done");

  //
};

const t1 = async () => {

  const periodInSec: number = 2;

  const obs = interval(periodInSec * 100);

  const obsafew = obs
      .pipe(
        take(3),
        map((x) => `this is ${x}`));

  const subscr = obsafew.subscribe(v => console.log(`obsafew: ${v}`));
  

  console.info("done");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.info("done done");

}

const t2 = async () => {
  const level1Ms: number = 1000;
  const level1Ticks: number = 2;
  const i1 = interval(level1Ms).pipe(take(level1Ticks));

  const level2Ms: number = 500;
  const level2Ticks: number = 3;
  const i2 = interval(level2Ms).pipe(take(level2Ticks));

  const level3Ms: number = 200;
  const level3Ticks: number = 5;
  const i3 = interval(level3Ms).pipe(take(level3Ticks));

  const timerInterval = 
    concat(i1, i2, i3).pipe(startWith(666));

  const subscr = timerInterval.subscribe({
    next: (v) => console.log(`1 tick: ${v}`),
    error: (e) => console.error(`1 tick error: ${e}`),
    complete: () => console.info('1 ticks finito') 
  });

  await new Promise((resolve) => setTimeout(resolve, 2500));

  const subscr2 = timerInterval.subscribe({
    next: (v) => console.log(`2 tick: ${v}`),
    error: (e) => console.error(`2 tick error: ${e}`),
    complete: () => console.info('2 ticks finito') 
  });

  console.info("done");
  await new Promise((resolve) => setTimeout(resolve, 8000));
  //subscr.unsubscribe();
  console.info("done done");
}

const t3 = async () => {
  const level1Ms: number = 1000;
  const level1Ticks: number = 2;
  const i1 = interval(level1Ms).pipe(map(v => `t1:${v}`), take(level1Ticks));

  const level2Ms: number = 400;
  const level2Ticks: number = 7;
  const i2 = interval(level2Ms).pipe(take(level2Ticks));

  //const cmbnd = combineLatest([i1, i2]);
  const cmbnd = i2.pipe(withLatestFrom(i1));

  const subscr = cmbnd.subscribe({
    next: (v) => console.log(`cmbnd: ${v}`),
    error: (e) => console.error(`cmbnd error: ${e}`),
    complete: () => console.info('cmbnd finito') 
  });

  console.info("done");
  await new Promise((resolve) => setTimeout(resolve, 8000));
  //subscr.unsubscribe();
  console.info("done done");
}

const t4 = async () => {
  const monsters = of("red", "blue", "purple")
    .pipe(repeat(100));
  //const monsters = of([1,2]);

  const level2Ms: number = 400;
  const level2Ticks: number = 20;
  const i2 = interval(level2Ms).pipe(take(level2Ticks));

  //const cmbnd = combineLatest([i1, i2]);
  //const cmbnd = i2.pipe(withLatestFrom(i1));
  const cmbnd = zip([monsters, i2])
    .pipe(map(tuple => tuple[0]));

  const subscr = cmbnd.subscribe({
    next: (v) => console.log(`cmbnd: ${v}`),
    error: (e) => console.error(`cmbnd error: ${e}`),
    complete: () => console.info('cmbnd finito') 
  });

  console.info("done");
  await new Promise((resolve) => setTimeout(resolve, 8000));
  //subscr.unsubscribe();
  console.info("done done");
}

const t5 = async () => {
  const level1Ms: number = 500;
  const level1Ticks: number = 10;
  const i1 = interval(level1Ms).pipe(take(level1Ticks));

  //const timerInterval = i1;
  const timerInterval = 
    i1.pipe(share({connector: () => new Subject()}));

  console.log(`subscription 1 starting`);
  const subscr = timerInterval.subscribe({
    next: (v) => console.log(`subscriber 1 tick: ${v}`),
    error: (e) => console.error(`subscriber 1 tick error: ${e}`),
    complete: () => console.info('subscriber 1 ticks finito') 
  });

  await new Promise((resolve) => setTimeout(resolve, 2100));

  console.log(`subscription 2 starting`);
  const subscr2 = timerInterval.subscribe({
    next: (v) => console.log(`subscriber 2 tick: ${v}`),
    error: (e) => console.error(`subscriber 2 tick error: ${e}`),
    complete: () => console.info('subscriber 2 ticks finito') 
  });

}

const fibonacci = () => {

  range(0, 10)
    .pipe(
      scan((acc, _) => [acc[1], acc[0] + acc[1]], [0, 1])
      ,map(acc => acc[1]))
  .subscribe(console.log);

}

//console.info("aha?");
//const bpa = f("what");
//console.info(bpa);

//testRxjs();
//const a = weird();
//console.info(a.toString());

//t1();
//t2();
//t3();
//t4();
//t5();
fibonacci();

//console.info("done");
  