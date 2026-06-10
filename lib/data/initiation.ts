export type InitiationLevel = {
  id: string;
  name: string;
  title: string;
  rank: number;
  symbol: string;
  color: string;
  description: string;
  requirement: string;
  unlockedChambers: string[];
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  content: string;
  quest?: Quest;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  task: string;
  reward: string;
};

export const INITIATION_LEVELS: InitiationLevel[] = [
  {
    id: 'seeker',
    name: 'Seeker',
    title: 'The Uninitiated One',
    rank: 0,
    symbol: '○',
    color: '#e8d5ff',
    description: 'You have arrived at the threshold. The gate stands before you — neither open nor closed. The first step of the Great Work is simply to begin.',
    requirement: 'Register and complete the Entry Ritual',
    unlockedChambers: ['divination', 'symbols'],
    lessons: [
      {
        id: 'seeker-1',
        title: 'What Is Occultism?',
        duration: '5 min',
        content: 'Occultism (from the Latin occultus — hidden) is not about superstition or evil. It is the systematic study of forces, laws, and dimensions of reality not accessible through ordinary sensory perception. Every major civilization has had its occult tradition: the Greeks had the Eleusinian Mysteries, the Egyptians had the mystery schools of Thoth, the Jews developed Kabbalah, the Arabs advanced astrology and alchemy. The "hidden" is not hidden because it is forbidden — it is hidden because it requires preparation to perceive.',
        quest: {
          id: 'q-seeker-1',
          title: 'The First Symbol',
          description: 'Every magical tradition begins with symbol recognition.',
          task: 'Visit the Chamber of Symbols and read about any three symbols that call to you. Record in your grimoire what drew you to them.',
          reward: '50 Akashic Points + Unlock: Chamber of Dreams',
        },
      },
      {
        id: 'seeker-2',
        title: 'The Hermetic Principles',
        duration: '8 min',
        content: 'The seven Hermetic Principles, as recorded in the Kybalion, are the foundational laws of the esoteric universe: 1. Mentalism — All is Mind; the Universe is Mental. 2. Correspondence — As above, so below. 3. Vibration — Nothing rests; everything moves. 4. Polarity — Everything has poles; opposites are identical in nature. 5. Rhythm — The pendulum swing manifests in everything. 6. Cause and Effect — Chance is merely a name for unrecognized law. 7. Gender — Gender manifests in everything as the masculine and feminine principles.',
      },
    ],
  },
  {
    id: 'adept',
    name: 'Adept',
    title: 'Student of the Hidden Arts',
    rank: 1,
    symbol: '△',
    color: '#00e5ff',
    description: 'The veil has been lifted by an inch. You have seen that what appears ordinary conceals extraordinary depth. You begin to read the symbol language of the universe.',
    requirement: 'Complete all Seeker lessons and 2 quests',
    unlockedChambers: ['divination', 'symbols', 'dreams'],
    lessons: [
      {
        id: 'adept-1',
        title: 'The Four Elements',
        duration: '10 min',
        content: 'Fire, Water, Air, Earth — not merely physical substances but qualities of reality itself. Fire: the transformative, expanding, active principle. Water: the receptive, flowing, emotional principle. Air: the intellectual, communicating, connecting principle. Earth: the manifested, stable, material principle. Every action, thought, and experience is a combination of these four. The Magician\'s altar holds all four: wand (fire), chalice (water), sword (air), pentacle (earth).',
        quest: {
          id: 'q-adept-1',
          title: 'Elemental Reading',
          description: 'Experience the four elements through divination.',
          task: 'Perform a Tarot reading using the Four Aces (Wands, Cups, Swords, Pentacles) as your spread positions.',
          reward: '100 Akashic Points + Unlock: Chamber of Spirits',
        },
      },
    ],
  },
  {
    id: 'magician',
    name: 'Magician',
    title: 'Wielder of the Wand',
    rank: 2,
    symbol: '⚡',
    color: '#ff00cc',
    description: 'You have learned that consciousness is not merely the observer — it is the operating principle. Intention shapes reality. The Magician\'s tools are on the table. Learn to use them.',
    requirement: 'Complete all Adept lessons, 5 total quests, perform 10 tarot readings',
    unlockedChambers: ['divination', 'symbols', 'dreams', 'spirits', 'synchronicities'],
    lessons: [
      {
        id: 'magician-1',
        title: 'The Art of Ritual',
        duration: '12 min',
        content: 'Ritual is not superstition — it is technology. Through ritual, we bypass the rational mind\'s gatekeeping and speak directly to the symbolic layer of consciousness. Ritual works because it works on attention: it creates sacred space (separation from ordinary time), concentrates intention (the magical act), and marks completion (the dissolution back into ordinary reality). This is why rituals across cultures are structurally identical: initiation, sacrifice, transformation, return.',
      },
    ],
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    title: 'Master of Transformation',
    rank: 3,
    symbol: '⚗',
    color: '#ffd700',
    description: 'You begin to understand that you are both the alchemist and the material. The Great Work is the work of transforming yourself. You have passed through the nigredo.',
    requirement: 'Complete all Magician lessons, submit 5 dreams, discover 5 synchronicities',
    unlockedChambers: ['divination', 'symbols', 'dreams', 'spirits', 'synchronicities', 'oracles'],
    lessons: [],
  },
  {
    id: 'oracle',
    name: 'Oracle',
    title: 'Voice Between Worlds',
    rank: 4,
    symbol: '◈',
    color: '#ff6b35',
    description: 'The boundary between receiver and transmitter has dissolved. You carry the capacity to perceive what others cannot yet see.',
    requirement: 'Complete all Alchemist content, consult all 7 Oracle personas, contribute to the Dream Atlas',
    unlockedChambers: ['all'],
    lessons: [],
  },
  {
    id: 'hierophant',
    name: 'Hierophant',
    title: 'Keeper of the Sacred Keys',
    rank: 5,
    symbol: '⛪',
    color: '#ffb6e6',
    description: 'You have moved from student to keeper. You carry knowledge not for yourself alone but to transmit to those who come after you.',
    requirement: 'Reach Oracle level, contribute 10 symbol annotations, 3 synchronicity reports',
    unlockedChambers: ['all'],
    lessons: [],
  },
  {
    id: 'illuminated',
    name: 'Illuminated',
    title: 'The Living Grimoire',
    rank: 6,
    symbol: '☀',
    color: '#ffd700',
    description: 'You have become the book. The grimoire is no longer something you read — it reads you. Your presence in the archive is itself a contribution to the collective awakening.',
    requirement: 'Complete all levels, achieve 1000 Akashic Points, leave a permanent contribution to the Codex',
    unlockedChambers: ['all'],
    lessons: [],
  },
];

export const AKASHIC_POINT_ACTIONS = [
  { action: 'Complete a lesson', points: 25 },
  { action: 'Complete a quest', points: 75 },
  { action: 'Submit a dream', points: 30 },
  { action: 'Record a synchronicity', points: 40 },
  { action: 'Perform a tarot reading', points: 10 },
  { action: 'Annotate a symbol', points: 20 },
  { action: 'Consult an Oracle persona', points: 15 },
  { action: 'Daily ritual visit', points: 5 },
];
