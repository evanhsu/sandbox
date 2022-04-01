import { hasMessage, sleep, sleepThenThrow, Timer } from '../utils';

/**
 * 06-concurrent-async-processing-unhandled
 * Introduce unhandled errors in async edge-cases
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
 * Process all Things in the collection simultaneously.
 * This function returns after every Thing has been processed.
 */
const processCollectionOfThingsInParallel = async (things: Thing[]) => {
  const timer = new Timer('Processing in parallel');
  let processedThings = [];

  try {
    processedThings = await Promise.allSettled(
      things.map(async (thing) => {
        if (thing.color === 'orange') {
          return processOneThing(thing, true); // FAIL for the orange Thing
        }
        return processOneThing(thing);
      })
    );
  } catch (error: unknown) {
    if (hasMessage(error)) {
      return error;
    }
    // Unknown error, let it bubble up
    throw error;
  }

  timer.stop().log();
  return processedThings;
};

const main = async () => {
  console.log('Starting');

  const data = fetchSeveralThings();
  const thingsProcessedInParallel = await processCollectionOfThingsInParallel(
    data
  );
  console.log(thingsProcessedInParallel);

  console.log('Bottom of main');
};

main();
