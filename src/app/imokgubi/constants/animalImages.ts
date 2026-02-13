import type { StaticImageData } from 'next/image';
import animals from '../constant/animals.json';
import bearImg from '@/assets/images/imokgubi/animals/bear.png';
import belugaImg from '@/assets/images/imokgubi/animals/beluga.png';
import camelImg from '@/assets/images/imokgubi/animals/camel.png';
import crocodileImg from '@/assets/images/imokgubi/animals/crocodile.png';
import crowImg from '@/assets/images/imokgubi/animals/crow.png';
import deerImg from '@/assets/images/imokgubi/animals/deer.png';
import dogImg from '@/assets/images/imokgubi/animals/dog.png';
import dolphinImg from '@/assets/images/imokgubi/animals/dolphin.png';
import donkeyImg from '@/assets/images/imokgubi/animals/donkey.png';
import dragonImg from '@/assets/images/imokgubi/animals/dragon.png';
import eagleImg from '@/assets/images/imokgubi/animals/eagle.png';
import elephantImg from '@/assets/images/imokgubi/animals/elephant.png';
import foxImg from '@/assets/images/imokgubi/animals/fox.png';
import frogImg from '@/assets/images/imokgubi/animals/frog.png';
import gorillaImg from '@/assets/images/imokgubi/animals/gorilla.png';
import hamsterImg from '@/assets/images/imokgubi/animals/hamster.png';
import hippoImg from '@/assets/images/imokgubi/animals/hippo.png';
import horseImg from '@/assets/images/imokgubi/animals/horse.png';
import jellyfishImg from '@/assets/images/imokgubi/animals/jellyfish.png';
import kangarooImg from '@/assets/images/imokgubi/animals/kangaroo.png';
import koalaImg from '@/assets/images/imokgubi/animals/koala.png';
import lionImg from '@/assets/images/imokgubi/animals/lion.png';
import lizardImg from '@/assets/images/imokgubi/animals/lizard.png';
import moleImg from '@/assets/images/imokgubi/animals/mole.png';
import monkeyImg from '@/assets/images/imokgubi/animals/monkey.png';
import mouseImg from '@/assets/images/imokgubi/animals/mouse.png';
import owlImg from '@/assets/images/imokgubi/animals/owl.png';
import oxImg from '@/assets/images/imokgubi/animals/ox.png';
import pandaImg from '@/assets/images/imokgubi/animals/panda.png';
import peacockImg from '@/assets/images/imokgubi/animals/peacock.png';
import penguinImg from '@/assets/images/imokgubi/animals/penguin.png';
import pigImg from '@/assets/images/imokgubi/animals/pig.png';
import pufferfishImg from '@/assets/images/imokgubi/animals/pufferfish.png';
import rabbitImg from '@/assets/images/imokgubi/animals/rabbit.png';
import raccoonImg from '@/assets/images/imokgubi/animals/raccoon.png';
import roosterImg from '@/assets/images/imokgubi/animals/rooster.png';
import sealImg from '@/assets/images/imokgubi/animals/seal.png';
import seasquirtImg from '@/assets/images/imokgubi/animals/seasquirt.png';
import sheepImg from '@/assets/images/imokgubi/animals/sheep.png';
import slothImg from '@/assets/images/imokgubi/animals/sloth.png';
import snakeImg from '@/assets/images/imokgubi/animals/snake.png';
import squidImg from '@/assets/images/imokgubi/animals/squid.png';
import squirrelImg from '@/assets/images/imokgubi/animals/squirrel.png';
import tigerImg from '@/assets/images/imokgubi/animals/tiger.png';
import turtleImg from '@/assets/images/imokgubi/animals/turtle.png';
import tyrannosaurusImg from '@/assets/images/imokgubi/animals/tyrannosaurus.png';
import velociraptorImg from '@/assets/images/imokgubi/animals/velociraptor.png';
import wolfImg from '@/assets/images/imokgubi/animals/wolf.png';

export type AnimalKey = keyof typeof animals;

export const animalImages: Record<AnimalKey, StaticImageData> = {
  bear: bearImg,
  beluga: belugaImg,
  camel: camelImg,
  crocodile: crocodileImg,
  crow: crowImg,
  deer: deerImg,
  dog: dogImg,
  dolphin: dolphinImg,
  donkey: donkeyImg,
  dragon: dragonImg,
  eagle: eagleImg,
  elephant: elephantImg,
  fox: foxImg,
  frog: frogImg,
  gorilla: gorillaImg,
  hamster: hamsterImg,
  hippo: hippoImg,
  horse: horseImg,
  jellyfish: jellyfishImg,
  kangaroo: kangarooImg,
  koala: koalaImg,
  lion: lionImg,
  lizard: lizardImg,
  mole: moleImg,
  monkey: monkeyImg,
  mouse: mouseImg,
  owl: owlImg,
  ox: oxImg,
  panda: pandaImg,
  peacock: peacockImg,
  penguin: penguinImg,
  pig: pigImg,
  pufferfish: pufferfishImg,
  rabbit: rabbitImg,
  raccoon: raccoonImg,
  rooster: roosterImg,
  seal: sealImg,
  seasquirt: seasquirtImg,
  sheep: sheepImg,
  sloth: slothImg,
  snake: snakeImg,
  squid: squidImg,
  squirrel: squirrelImg,
  tiger: tigerImg,
  turtle: turtleImg,
  tyrannosaurus: tyrannosaurusImg,
  velociraptor: velociraptorImg,
  wolf: wolfImg,
};
