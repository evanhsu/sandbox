import { sleepThenThrow, Timer } from '../utils';

const main = async () => {
  console.log('asuh world');
  const timer = new Timer();
  await sleepThenThrow(2);
  timer.stop().log();
};

main();
