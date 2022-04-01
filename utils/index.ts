/**
 * Pause for the specified number of seconds, then continue.
 * This function is implemented using a plain Promise, which resolves after
 * the specified delay.
 */
const sleepPromise = (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

/**
 * Pause for the specified number of seconds, then continue
 * This function is implemented using async/await.
 */
export const sleep = async (seconds: number) => {
  return await sleepPromise(seconds);
};

/**
 * Pause for the specified number of seconds, then throw an error.
 */
export const sleepThenThrow = async (
  seconds: number,
  errorMessage = 'This is the error message'
) => {
  await sleep(seconds);
  throw new Error(errorMessage);
};

export function hasMessage(maybeError: any): maybeError is Error {
  return Object.prototype.hasOwnProperty.call(maybeError, 'message');
}

/**
 * Keeps track of how much time elapses between two points, and can log the result.
 * Usage:
 *   const myTimer = new Timer();
 *   ... do some stuff
 *   myTimer.stop().log();
 */
export class Timer {
  private startTime: number;
  private endTime: number | null = null;

  constructor(private name = 'Timer') {
    this.name = name;
    this.startTime = Date.now();
  }

  stop() {
    this.endTime = Date.now();
    return this;
  }

  log(...args: any[]) {
    if (this.endTime !== null) {
      console.log(
        `Time elapsed during ${this.name}: ${this.endTime - this.startTime}ms`,
        ...args
      );
    } else {
      console.log(
        `Time elapsed during ${this.name} (so far): ${
          Date.now() - this.startTime
        }ms`,
        ...args
      );
    }
  }
}
