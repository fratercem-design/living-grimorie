export type OccultSymbol = {
  id: string;
  name: string;
  glyph: string;
  tradition: string[];
  categories: string[];
  summary: string;
  history: string;
  magicalUses: string[];
  psychologicalMeaning: string;
  relatedSymbols: string[];
  akashicLinks: string[];
};

export const SYMBOLS: OccultSymbol[] = [
  {
    id: 'pentagram',
    name: 'Pentagram',
    glyph: '⛤',
    tradition: ['Wicca', 'Western Ceremonial Magic', 'Pythagoreanism', 'Medieval Christianity'],
    categories: ['protection', 'elemental', 'divine-proportion'],
    summary: 'Five-pointed star representing the five elements, the human microcosm, and divine proportion.',
    history: 'Used by the Pythagoreans as a symbol of health and perfection. Medieval Christians used it to represent the five wounds of Christ. Later adopted by ceremonial magicians as a symbol of the elements and human mastery over them. Inverted, it became associated with the material over the spiritual.',
    magicalUses: [
      'Casting and sealing protective circles',
      'Invoking and banishing elemental forces',
      'Consecrating ritual space',
      'Drawing down divine energy',
    ],
    psychologicalMeaning: 'The pentagram as the body of the human being — arms and legs outstretched, the fifth point being the head/spirit. Jung saw geometric symbols as mandalas of the psyche, tools of centration.',
    relatedSymbols: ['hexagram', 'circle', 'eye-of-providence', 'ankh'],
    akashicLinks: ['lesser-banishing-ritual', 'wicca-traditions', 'sacred-geometry', 'golden-ratio'],
  },
  {
    id: 'eye-of-horus',
    name: 'Eye of Horus',
    glyph: '𓂀',
    tradition: ['Ancient Egyptian', 'Hermetic', 'New Age'],
    categories: ['protection', 'healing', 'vision', 'solar'],
    summary: 'The sacred eye of the falcon god Horus — symbol of protection, royal power, and omniscient vision.',
    history: 'In Egyptian mythology, Horus lost his left eye in battle with Set, the god of chaos. The eye was healed by Thoth and became the wedjat — a symbol of wholeness and healing. The fractions of the eye correspond to the six senses (5+1) and together add to 63/64, with the missing 64th restored by Thoth\'s magic.',
    magicalUses: [
      'Amulet for protection against the evil eye',
      'Healing rituals',
      'Scrying and vision work',
      'Solar invocations',
    ],
    psychologicalMeaning: 'The eye that perceives beyond ordinary sight. The capacity of consciousness to observe itself — the awareness behind awareness. Symbol of the Self watching the ego.',
    relatedSymbols: ['ankh', 'djed-pillar', 'eye-of-ra', 'all-seeing-eye'],
    akashicLinks: ['horus-mythology', 'thoth-hermes', 'egyptian-magic', 'third-eye'],
  },
  {
    id: 'ouroboros',
    name: 'Ouroboros',
    glyph: '🐍',
    tradition: ['Ancient Egyptian', 'Gnostic', 'Hermetic', 'Norse', 'Alchemical'],
    categories: ['cyclical', 'infinity', 'transformation', 'time'],
    summary: 'The serpent devouring its own tail — eternity, cyclical existence, and the unity of all opposites.',
    history: 'One of the oldest mystical symbols, appearing in Egyptian texts and Gnostic manuscripts. In alchemy, it represents the Prima Materia and the circular nature of the Great Work. For the Norse, it is Jörmungandr encircling Midgard. For Gnostics, it represents the eternal return and the pleroma.',
    magicalUses: [
      'Meditation on cyclical time and eternity',
      'Binding and sealing spells',
      'Alchemical transformation rituals',
      'Accessing the akashic record',
    ],
    psychologicalMeaning: 'Jung used the ouroboros as a primary symbol of the collective unconscious. It represents the integration of shadow — the psyche consuming and recycling its own contents in the individuation process.',
    relatedSymbols: ['infinity-symbol', 'spiral', 'wheel-of-fortune', 'serpent'],
    akashicLinks: ['alchemical-work', 'jormungandr', 'gnostic-cosmology', 'eternal-return', 'nietzsche'],
  },
  {
    id: 'hexagram',
    name: 'Hexagram / Star of David',
    glyph: '✡',
    tradition: ['Kabbalah', 'Ceremonial Magic', 'Hinduism', 'Judaism', 'Alchemy'],
    categories: ['union-of-opposites', 'macrocosm', 'elemental', 'divine'],
    summary: 'Two interlocked triangles representing the union of above and below, fire and water, masculine and feminine.',
    history: 'In alchemy, the downward triangle represents water and the feminine; the upward triangle, fire and the masculine. Their union creates the Seal of Solomon, used in ceremonial magic to command spirits. In Kabbalah it corresponds to Tiphareth, the heart of the Tree of Life.',
    magicalUses: [
      'Invoking divine balance and harmony',
      'Planetary magic rituals',
      'Sealing pacts and covenants',
      'Centering the heart chakra / Tiphareth',
    ],
    psychologicalMeaning: 'The sacred marriage of the masculine rational principle (upward triangle) with the feminine feeling principle (downward triangle). As above, so below — the human being as microcosm of the cosmos.',
    relatedSymbols: ['pentagram', 'tree-of-life', 'mandala', 'sri-yantra'],
    akashicLinks: ['kabbalah-tiphareth', 'seal-of-solomon', 'as-above-so-below', 'sacred-geometry'],
  },
  {
    id: 'ankh',
    name: 'Ankh',
    glyph: '☥',
    tradition: ['Ancient Egyptian', 'Coptic Christian', 'New Age'],
    categories: ['life', 'immortality', 'union', 'divine-key'],
    summary: 'The Egyptian cross of life — the key of the Nile, symbol of eternal existence and divine blessing.',
    history: 'The ankh, or crux ansata (cross with a handle), is one of the most ancient symbols of life. It was held by gods and pharaohs alike, pressed to the lips to "give life." Some scholars derive it from a sandal strap; others see the union of male and female sexual symbols. Coptic Christians later adopted it as a cross of resurrection.',
    magicalUses: [
      'Life-force and vitality rituals',
      'Healing and longevity workings',
      'Immortality and resurrection symbolism',
      'Unlocking hidden knowledge',
    ],
    psychologicalMeaning: 'The loop (circle) represents eternal consciousness; the cross below, the material world. Together they signify the eternal animating the temporal — spirit incarnated in matter.',
    relatedSymbols: ['cross', 'eye-of-horus', 'djed-pillar', 'tau-cross'],
    akashicLinks: ['egyptian-afterlife', 'osiris-resurrection', 'coptic-christianity'],
  },
  {
    id: 'sri-yantra',
    name: 'Sri Yantra',
    glyph: '🔺',
    tradition: ['Hinduism', 'Tantra', 'Sacred Geometry'],
    categories: ['divine-feminine', 'cosmic-order', 'meditation', 'creation'],
    summary: 'The supreme yantra of nine interlocked triangles representing the union of Shiva and Shakti and the entire cosmos.',
    history: 'Considered the most sacred geometric symbol in Hindu tantra, the Sri Yantra emerged from the Vedic tradition. Its nine triangles create 43 smaller triangles, arranged around a central point (bindu) representing the cosmic origin. It is said to contain the geometry of the universe and when meditated upon, provides access to the divine matrix.',
    magicalUses: [
      'Deep meditation and samadhi',
      'Attracting abundance and prosperity',
      'Cosmic consciousness activation',
      'Yantra worship (puja)',
    ],
    psychologicalMeaning: 'The Sri Yantra maps the structure of consciousness itself. The outer squares are the manifest world; the inner triangles, the increasingly subtle levels of awareness; the bindu at center, the Self beyond all attributes.',
    relatedSymbols: ['hexagram', 'mandala', 'flower-of-life', 'metatrons-cube'],
    akashicLinks: ['shakti', 'shiva', 'tantra', 'sacred-geometry', 'vedic-tradition'],
  },
  {
    id: 'baphomet',
    name: 'Baphomet',
    glyph: '🐐',
    tradition: ['Knights Templar', 'Occultism', 'Thelema', 'Satanism'],
    categories: ['duality', 'shadow', 'transgression', 'synthesis'],
    summary: 'The sabbatic goat — a symbol of the reconciliation of opposites and the transgressive wisdom of the Shadow.',
    history: 'Baphomet was allegedly worshipped by the Knights Templar, though historians debate its origins. Éliphas Lévi\'s iconic 1854 illustration depicted a winged, hermaphroditic goat figure — pointing upward and downward — as the reconciliation of all opposites. Later adopted by Aleister Crowley and Anton LaVey, though with radically different interpretations.',
    magicalUses: [
      'Shadow integration work',
      'Transgressive initiation rituals',
      'Invocation of the lower self for transformation',
      'Symbol of complete self-knowledge (knowing light and dark)',
    ],
    psychologicalMeaning: 'Jung\'s Shadow made visible. Baphomet represents what civilization suppresses — instinct, sexuality, transgression, chaos. The initiate who meets Baphomet and is not destroyed is transformed.',
    relatedSymbols: ['pentagram-inverted', 'goat-of-mendes', 'devil-card', 'pan'],
    akashicLinks: ['knights-templar', 'eliphas-levi', 'aleister-crowley', 'shadow-archetype', 'devil-tarot'],
  },
  {
    id: 'caduceus',
    name: 'Caduceus',
    glyph: '⚕',
    tradition: ['Greek', 'Hermetic', 'Alchemical', 'Medicine'],
    categories: ['healing', 'duality', 'alchemy', 'messenger'],
    summary: 'Two serpents coiled around a winged staff — the wand of Hermes and the symbol of alchemical transformation.',
    history: 'The caduceus belongs to Hermes (Mercury), the divine messenger and psychopomp who guided souls between worlds. The two serpents represent opposing forces brought into dynamic balance. In alchemy, the caduceus is the symbol of the Hermetic art — the dissolution and coagulation of matter through Mercury\'s principle.',
    magicalUses: [
      'Healing and medical magic',
      'Balancing polarized energies',
      'Invoking Hermes/Mercury for communication and travel',
      'Psychopomp work — guiding transitions',
    ],
    psychologicalMeaning: 'The caduceus maps the nervous system — the central channel (sushumna) with twin energies (ida/pingala) spiraling upward to divine consciousness. The winged staff is the awakened spine.',
    relatedSymbols: ['serpent', 'staff-of-asclepius', 'winged-sun', 'kundalini'],
    akashicLinks: ['hermes-trismegistus', 'alchemy', 'kundalini', 'thoth'],
  },
];

export const SYMBOL_CATEGORIES = [
  'protection',
  'transformation',
  'healing',
  'divinity',
  'duality',
  'elemental',
  'cosmic',
  'shadow',
  'sacred-geometry',
  'celestial',
];
