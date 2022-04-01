import { sleep, Timer } from '../utils';

const doThreeThingsConcurrently = () => {
  const timer = new Timer();

  sleep(2).then(() => timer.log('Sleep 2'));
  sleep(1).then(() => timer.log('Sleep 1'));
  sleep(3).then(() => timer.log('Sleep 3'));
};

const main = async () => {
  console.log('asuh world');
  doThreeThingsConcurrently();
  console.log('done... right?');
};

main();
