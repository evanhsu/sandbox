import { sleep, Timer } from '../utils';

const main = async () => {
  console.log('asuh world');
  const timer = new Timer();
  await sleep(2);
  timer.stop().log();
};

main();
