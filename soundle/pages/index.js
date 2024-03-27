import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
const champs = [
  "Aatrox",
  "Ahri",
  "Akali",
  "Akshan",
  "Alistar",
  "Amumu",
  "Anivia",
  "Annie",
  "Aphelios",
  "Ashe",
  "Aurelion Sol",
  "Azir",
  "Bard",
  "Bel'Veth",
  "Blitzcrank",
  "Brand",
  "Braum",
  "Briar",
  "Caitlyn",
  "Camille",
  "Cassiopeia",
  "Cho'Gath",
  "Corki",
  "Darius",
  "Diana",
  "Dr. Mundo",
  "Draven",
  "Ekko",
  "Elise",
  "Evelynn",
  "Ezreal",
  "Fiddlesticks",
  "Fiora",
  "Fizz",
  "Galio",
  "Gangplank",
  "Garen",
  "Gnar",
  "Gragas",
  "Graves",
  "Gwen",
  "Hecarim",
  "Heimerdinger",
  "Hwei",
  "Illaoi",
  "Irelia",
  "Ivern",
  "Janna",
  "Jarvan IV",
  "Jax",
  "Jayce",
  "Jhin",
  "Jinx",
  "K'Sante",
  "Kai'Sa",
  "Kalista",
  "Karma",
  "Karthus",
  "Kassadin",
  "Katarina",
  "Kayle",
  "Kayn",
  "Kennen",
  "Kha'Zix",
  "Kindred",
  "Kled",
  "Kog'Maw",
  "LeBlanc",
  "Lee Sin",
  "Leona",
  "Lillia",
  "Lissandra",
  "Lucian",
  "Lulu",
  "Lux",
  "Malphite",
  "Malzahar",
  "Maokai",
  "Master Yi",
  "Milio",
  "Miss Fortune",
  "Mordekaiser",
  "Morgana",
  "Naafiri",
  "Nami",
  "Nasus",
  "Nautilus",
  "Neeko",
  "Nidalee",
  "Nilah",
  "Nocturne",
  "Nunu & Willump",
  "Olaf",
  "Orianna",
  "Ornn",
  "Pantheon",
  "Poppy",
  "Pyke",
  "Qiyana",
  "Quinn",
  "Rakan",
  "Rammus",
  "Rek'Sai",
  "Rell",
  "Renata Glasc",
  "Renekton",
  "Rengar",
  "Riven",
  "Rumble",
  "Ryze",
  "Samira",
  "Sejuani",
  "Senna",
  "Seraphine",
  "Sett",
  "Shaco",
  "Shen",
  "Shyvana",
  "Singed",
  "Sion",
  "Sivir",
  "Skarner",
  "Smolder",
  "Sona",
  "Soraka",
  "Swain",
  "Sylas",
  "Syndra",
  "Tahm Kench",
  "Taliyah",
  "Talon",
  "Taric",
  "Teemo",
  "Thresh",
  "Tristana",
  "Trundle",
  "Tryndamere",
  "Twisted Fate",
  "Twitch",
  "Udyr",
  "Urgot",
  "Varus",
  "Vayne",
  "Veigar",
  "Vel'Koz",
  "Vex",
  "Vi",
  "Viego",
  "Viktor",
  "Vladimir",
  "Volibear",
  "Warwick",
  "Wukong",
  "Xayah",
  "Xerath",
  "Xin Zhao",
  "Yasuo",
  "Yone",
  "Yorick",
  "Yuumi",
  "Zac",
  "Zed",
  "Zeri",
  "Ziggs",
  "Zilean",
  "Zoe",
  "Zyra",
];

let abilities = ["Q", "W", "E", "R"];

const fs = require("fs");
const path = require("path");

function getRandomAbility() {
  let champ = champs[Math.floor(Math.random() * champs.length)];
  let ability = abilities[Math.floor(Math.random() * abilities.length)];
  const matchingFiles = [];

  fs.readdirSync(
    "./public/sounds"
  ).forEach((file) => {
    if (file.startsWith(`${champ}_Original_${ability}`)) {
      matchingFiles.push(file);
    }
  });

  if (matchingFiles.length < 1) {
    return getRandomAbility();
  } else {
    return {
      champ: champ,
      ability: ability,
      file: matchingFiles[Math.floor(Math.random() * matchingFiles.length)],
    };
  }
}

export const getServerSideProps = () => {
  console.log(getRandomAbility());
  let champs = [];

  for (let i = 0; i < 100; i++) {
    champs.push(getRandomAbility());
  }

  return { props: { champs: champs } };
};

export default function Home({ champs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  const audioRef = useRef();
  const audioDingRef = useRef();
  const inputRef = useRef();

  function skip()
  {
    setCurrentIndex(i => {
      audioRef.current.src = `sounds/${champs[i + 1].file}`;
      replay();
      return i + 1});
      setTimeLeft(old => old - 3);
  }

  function replay() {
    inputRef.current.focus();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    inputRef.current.focus();
  }

  function playSound(sound) {
    const audio = new Audio(sound);
    audio.volume = 0.2;
    audio.play();
  }

  function guess() {
    inputRef.current.focus();

    setCurrentIndex((old) => {
      const correctAnswer =
        `${champs[old].champ} ${champs[old].ability}`.trim();
      const currGuess = inputRef.current.value.trim();
      console.log(currGuess, correctAnswer);

      if (currGuess === correctAnswer) {
        audioRef.current.src = `sounds/${champs[old + 1].file}`;
        playSound("correct.mp3");
        setCurrentScore(i => i + 1);
        setTimeout(() => replay(), 300)
        return old + 1;
      } else if (inputRef.current.value.includes(champs[old].champ)) {
        playSound("sus.mp3");
        setCurrentGuess("partial");
      } else {
        playSound("incorrect.mp3");
        setCurrentGuess("wrong");
      }

      return old;
    });
  }

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
       if (event.keyCode == 18) {
         //space
         replay();
      }
      if (event.keyCode == 13) {
        //enter
        guess();
      }
    });

    setInterval(() => {
      setTimeLeft((old) => {
        if (old == 0) {
          return old;
          
        }
        return old - 1;
      });
    }, 1000);

    audioRef.current.volume = 0.2;
    audioDingRef.current.volume = 0.2;
  }, []);

  return (
    <div className="flex flex-row w-full h-screen bg-gray-200 justify-center">
      <div className="flex flex-col pt-36 items-center text-3xl">
        {
          <>
            <div className="flex flex-row gap-x-[4rem]">
              <div className="w-32 flex flex-col items-center">
                <p className="">Time:</p>
                <p className="text-8xl">{timeLeft}</p>
              </div>
              <div>
                <p className="">Score:</p>
                <p className="text-8xl">{currentScore}</p>
              </div>
            </div>

            <p>
              <audio ref={audioDingRef} hidden controls></audio>
              <source type="audio/mp3" />
              <audio ref={audioRef} hidden controls>
                <source
                  src={`sounds/${champs[currentIndex].file}`}
                  type="audio/ogg"
                />
              </audio>
              {""}
            </p>
            <div className="flex flex-row gap-x-4">
              <button
                onClick={skip}
                className="mt-16 px-8 py-2 bg-gray-400 rounded-2xl"
              >
                Skip
              </button>
              <button
                onClick={replay}
                className="mt-16 px-8 py-2 bg-gray-400 rounded-2xl"
              >
                Replay
              </button>
            </div>
            <input
              ref={inputRef}
              className={`bg-gray-300 text-gray-800 text-4xl p-2.5 my-8  rounded-2xl `}
            ></input>
            <button
              onClick={guess}
              className="px-8 py-2 bg-gray-400 rounded-2xl"
            >
              guess!
            </button>
          </>
        }
      </div>
    </div>
  );
}
