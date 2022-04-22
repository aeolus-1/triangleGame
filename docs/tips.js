var tips = [
  "Apply pressure to the W key to jump",
"This is the Gorbnos quest of github games",
"You can vote for color themes on the github",
"This is not really loading it all fake",
"If you really know me, you will know my Father as well. From now on, you do know him and have seen him. John 14:7",
"When anxiety was great within me, your consolation brought me joy. Psalm 94:19",
"I consider that our present sufferings are not worth comparing with the glory that will be revealed in us. Romans 8:18",
"To this you were called, because Christ suffered for you, leaving you an example, that you should follow in his steps. 1 Peter 2:21",
"Read this the end. I don't normally tell people this but you are the one exception. Im usally really untrusting at least thats what my wife says. Anyways, the secret to",
"if you want to win then don’t fall :)",
"If you when you when the you are the when you are",
"Have you tried to git gud?",
"Do you really wanna? Do you really wanna taste it?",
"Look at you with your dry — lips",
"To show you the power of flex tape",
"I sawed this tip in half",
"Jai wuz here",
"Sasha will you go out with me?",
"Patty smells like poo",
"Emma please come back",
"Can anyone drop some xan or md in Samford",
"Please help me ben has locked me in a room to write tips for his game",
"There is a dead body at the bush behind d block",
"Do it jiggle?",
"There are 12 versions of the show ‘the office’ such as a Indian, German and Finnish versions",
"Australia lost a war to birds",
"lasnga -garfield",
"Make sure a teacher isn’t behind you",
"I used to play triangle game like you until I took an arrow to the knee",
"Mr Behan is behind you",
"I don’t support Ukraine",
"Uhhhh mr witter were out of meth uhhh jesser",
"Ok stop playing this is gonna be on the test",
"Its called triangle game cause there’s on at the end",
"There’s a red spy in the base!",
"Uhh moty I turned my self into a cucumber, I’m cucumber rig",
"If you see bugs or want to suggest new things to be added you can do so at the GitHub page for the game",
"This game has vr support, don’t believe me? Shove your finger up your —",
"Hey now your a porn star, get you clothes off, get laid",
"STANDING HERE, I REALISE, YOU WERE JUST LIKE ME",
"So I walking down the street the other day when I saw this sign that said wood fired pizza, wood fired pizza I said? How is pizza gonna get a job now?",
"Not made using unitys particle system",
"Family guy funny moments",
"Raiden, Raiden! RAIIIIDEEEEN",
"Type ‘gulible’ while in game",
"Triangle game and knuckles",
"Eat my shorts",
"Wealth, fame, power, gold Rodger the king of the pirates had obtained this and everything else the world had to offer",
"I make a da shit in da terlet",
"If you read this ur gay",
"This is the gorbinos quest of GitHub games",
"Lol I’m running out of ideas",
"Mr Cambridge is behind you",
"12.4.5.3.4.34",
"😍😍😍",
"Also try Terraria",
"Also try Minecraft",
"Aquariums are submarines for fish",
"L + Ratio",
"Don’t kill yourself, play this game and die even quicker inside",
"undefined",
"❖❖❖❖❖❖",
"… --- …",
"Devopler pog",
"tip.png",
"Clyde was right",
"Did you know the highest grossing movie of all time is Morbius(2022)",
"Gonna give you up, Gonna let you fall, Gonna L + RatiooOOooOO",
"Don’t bully fat people guys, they got enough on their plate already",
"77 + 33 = 100 NOT 110",
"Dumbledore Dies",
"no, i am not going to add sexual intercourse to this game",
"Breaking: Mobius is the first movie to sell 1 trillion tickets",
"Meow?",
"We’re making the mother of all omelettes here jack, you can’t fret over every egg",
"L + no maidens + touch grace",
"The cake is a lie",
"I waking up, I slap my nuts",
"Yo angelo🗿",
"Go to r/WaterSports if you love jet skis",
"Long loooooooooòng maaann",
"I can make orange rhyme with banana, bornana",
"Don’t pee on the floor (use the comedore)",
"Baby back ayy",
"Áppłé….",
"Kiryu gaming",
"I got mug in my veins",
"I love lean!!! 💜",
"Hobo loco in stores now",
"I put ham In your smoothie",
"My wife loves to have dixen cider",
"Make sure to follow my only fans",
"L + no wenches + get booty + you have scurvy 🏴‍☠️",
"Hey did you know that only 34% of you are subscribed",
"Triangle game sponsored by RAID: shadow legends",
"Not a doctor shhhhhh",
"When a woman hit me with that dollar store taser",
"No bitches?",
"Andrew Garfield my beloved",
"Im looking for one Seymour butz, I wanna Seymour butz",
"I will come for you if you stop playing this game",
"You know you could be playing mini game quest instead (its much better)",
"If you don’t like the current color scheme then simply kys :)",
"I shoot my arrows in the air sometimes",
"I am a dwarf and I’m digging a hole",
"If I get one more complaint about my quotes I’m gonna start getting made",
"Like the good ol days after 9/11",



];
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
tips = shuffle(tips)

var tip = tips[Math.floor((new Date().getTime()/3000) % tips.length)];

