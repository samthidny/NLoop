# NLoop
NLoop is a javascript library for running loops in an asynchronous way.

It allows you to perform calculations on large amounts of data without freezing the browser.

NLoop allows you to see the progress of your calculations and as well as pause or stop the processing at any time.

For example, if you were to perform an algorithm that required you to loop through 1,000,000 x 1,000,000 x 1,000,000 could look something like this:

for(var x=0; x<1000000; x++) {
 for(var y=0; y<1000000; y++) {
   for(var z=0; z<1000000; z++) {
      doSomeCalculations(x, y, z);
    } 
  } 
}

This loop would just freeze the browser while it ran and take a long time or even timeout without being sure of it's progress.

NLoop will allow you to pause/resume or cancel a loop.

This is the very first prototype version.
