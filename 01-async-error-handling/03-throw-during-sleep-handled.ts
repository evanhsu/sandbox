import { hasMessage, sleepThenThrow, Timer } from '../utils';

const main = async () => {
  console.log('asuh world');
  const timer = new Timer();
  try {
    await sleepThenThrow(2);
  } catch (error: unknown) {
    // We typically can't guarantee the Type of 'error', so
    //  we declare it as 'unknown' for safety.
    // But this means that we need to explicitly check for
    // the error.message property before we try to access it.
    if (hasMessage(error)) {
      console.log(`Handling an error: ${error.message}`);
    } else {
      console.log(error);
    }
  }
  timer.stop().log();
};

main();
