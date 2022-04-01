import { hasMessage, sleep, sleepThenThrow, Timer } from '../utils';

/**
 * 06-concurrent-async-processing-handled
 *
 * This example builds on the previous one, using the same pattern but introducing
 * errors with error handling.
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
    processedThings.push(await processOneThing(thing));
  }
  timer.stop().log();
  return processedThings;
};

/**
 * Process all Things in the collection simultaneously.
 * This function returns after every Thing has been processed.
 */
const processCollectionOfThingsInParallel = async (things: Thing[]) => {
  const timer = new Timer('Processing in parallel');

  const processedThings = await Promise.allSettled(
    things.map((thing) => {
      try {
        if (thing.color === 'orange') {
          return processOneThing(thing, true); // FAIL for the orange Thing
        }
        return processOneThing(thing);
      } catch (error: unknown) {
        if (hasMessage(error)) {
          return error;
        }
        // Unknown error, let it bubble up
        throw error;
      }
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
