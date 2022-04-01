import { sleep, sleepThenThrow, Timer } from '../utils';

/**
 * 05-concurrent-async-processing
 *
 * This example is closer to a real-world scenario where a collection of
 * data is fetched, then processed.
 */
type Thing = {
  color: string;
  isProcessed: boolean;
};
const thingFactory = (color: Thing['color']): Thing => {
  return {
    color,
    isProcessed: false,
  };
};

const fetchSeveralThings = () => {
  return [thingFactory('red'), thingFactory('orange'), thingFactory('yellow')];
};

const processOneThing = async (thing: Thing, failWhileProcessing = false) => {
  // Simulate that processing takes some time
  failWhileProcessing ? await sleepThenThrow(1) : await sleep(1);

  // Return a new object, avoid mutating the input object
  return {
    ...thing,
    isProcessed: true,
  };
};

/**
 * Process each Thing one-at-a-time.
 * e.g. Thing 1 must finish processing before Thing 2 begins.
 * This function returns after every Thing has been processed.
 */
const processCollectionOfThingsInSeries = async (
  things: Thing[]
): Promise<Thing[]> => {
  const timer = new Timer('Processing in series');

  const processedThings: Thing[] = [];
  for (let thing of things) {
    // In this case, the result of one iteration doesn't affect the
    // processing of the next iteration so we don't really need to
    // wait on each iteration (we could speed things up by processing
    // in parallel)
    processedThings.push(await processOneThing(thing));
  }
  timer.stop().log();
  return processedThings;
};

/**
 * Process all Things in the collection simultaneously.
 * This function returns once every Thing has been processed.
 */
const processCollectionOfThingsInParallel = async (
  things: Thing[]
): Promise<Thing[]> => {
  const timer = new Timer('Processing in parallel');

  const processedThings = await Promise.all(
    things.map(async (thing) => {
      return await processOneThing(thing);
    })
  );

  timer.stop().log();
  return processedThings;
};

const main = async () => {
  console.log('Starting');

  const data = fetchSeveralThings();

  const thingsProcessedInSeries = await processCollectionOfThingsInSeries(data);
  console.log(thingsProcessedInSeries);

  const thingsProcessedInParallel = await processCollectionOfThingsInParallel(
    data
  );
  console.log(thingsProcessedInParallel);

  console.log('Bottom of main');
};

main();
