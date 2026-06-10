export type Entity = {
  id: string;
  name: string;
  type: 'angel' | 'demon' | 'deity' | 'spirit' | 'archetype' | 'mythological';
  tradition: string[];
  domains: string[];
  description: string;
  attributes: string[];
  relationships: { entityId: string; relationship: string }[];
  akashicLinks: string[];
  sigil?: string;
};

export const ENTITIES: Entity[] = [
  {
    id: 'metatron',
    name: 'Metatron',
    type: 'angel',
    tradition: ['Jewish Mysticism', 'Kabbalah', 'Enochian Magic'],
    domains: ['divine throne', 'cosmic order', 'akashic record', 'scribe of heaven'],
    description: 'The supreme archangel in Kabbalistic tradition, often identified with Enoch who was translated to heaven without dying. Metatron sits beside the divine throne and is the scribe of all cosmic events — keeper of the Akashic Record. His cube contains the patterns of all creation.',
    attributes: ['golden light', 'merkabah', 'cube of creation', 'divine scribe', 'cosmic order'],
    relationships: [
      { entityId: 'sandalphon', relationship: 'twin brother' },
      { entityId: 'thoth', relationship: 'corresponding deity' },
      { entityId: 'hermes', relationship: 'corresponding deity' },
    ],
    akashicLinks: ['kabbalah-kether', 'enochian-magic', 'sacred-geometry', 'akashic-record'],
    sigil: '✦',
  },
  {
    id: 'hecate',
    name: 'Hecate',
    type: 'deity',
    tradition: ['Greek', 'Roman', 'Chaldean', 'Wicca'],
    domains: ['crossroads', 'witchcraft', 'moon', 'ghosts', 'necromancy', 'liminality'],
    description: 'Triple goddess of the crossroads, witchcraft, and the liminal spaces between worlds. Hecate holds torches to illuminate the darkness, accompanied by black dogs and owls. She is invoked at crossroads at midnight and rules the transitions between life and death, between worlds.',
    attributes: ['three-faced', 'torches', 'keys', 'crossroads', 'black dogs', 'dark moon'],
    relationships: [
      { entityId: 'persephone', relationship: 'companion and guide' },
      { entityId: 'artemis', relationship: 'associated goddess' },
      { entityId: 'lilith', relationship: 'similar archetype' },
    ],
    akashicLinks: ['crossroads-magic', 'witchcraft-traditions', 'moon-symbolism', 'liminal-spaces', 'the-moon-tarot'],
    sigil: '☽',
  },
  {
    id: 'hermes-god',
    name: 'Hermes / Mercury',
    type: 'deity',
    tradition: ['Greek', 'Roman', 'Hermetic', 'Egyptian (as Thoth)'],
    domains: ['communication', 'travel', 'commerce', 'thieves', 'psychopomp', 'alchemy', 'magic'],
    description: 'The divine messenger, guide of souls, and trickster. Hermes moves between all worlds with effortless grace. As Mercury in alchemy, he represents the volatile, mercurial principle — the catalyst that enables transformation. As Thoth in Egypt, he is the inventor of writing and magic.',
    attributes: ['caduceus', 'winged sandals', 'winged helmet', 'trickster', 'boundary crosser'],
    relationships: [
      { entityId: 'thoth', relationship: 'Egyptian correspondence' },
      { entityId: 'metatron', relationship: 'angelic correspondence' },
      { entityId: 'loki', relationship: 'Norse trickster parallel' },
    ],
    akashicLinks: ['hermeticism', 'alchemy', 'caduceus', 'psychopomp', 'magician-tarot'],
    sigil: '☿',
  },
  {
    id: 'lilith',
    name: 'Lilith',
    type: 'demon',
    tradition: ['Hebrew Mythology', 'Kabbalah', 'Sumerian (Lilitu)', 'Modern Occultism'],
    domains: ['night', 'independence', 'sexuality', 'storm', 'infant mortality', 'feminine power'],
    description: 'Adam\'s first wife who refused to submit and was cast out of Eden — or so the later tradition claims. In Kabbalistic thought she rules the Qliphoth, the shadow side of the Tree of Life. In modern occultism she is reclaimed as a symbol of radical feminine autonomy, sexuality unconstrained by patriarchal law, and the dark feminine principle.',
    attributes: ['owl wings', 'night creature', 'long red hair', 'naked power', 'refuses submission'],
    relationships: [
      { entityId: 'hecate', relationship: 'dark feminine archetype correspondence' },
      { entityId: 'kali', relationship: 'dark goddess parallel' },
      { entityId: 'samael', relationship: 'consort in Kabbalistic demonology' },
    ],
    akashicLinks: ['kabbalah-qliphoth', 'dark-feminine', 'shadow-archetype', 'the-moon-tarot', 'feminist-occultism'],
    sigil: '🌑',
  },
  {
    id: 'thoth',
    name: 'Thoth',
    type: 'deity',
    tradition: ['Ancient Egyptian', 'Hermetic'],
    domains: ['writing', 'magic', 'wisdom', 'moon', 'judgment', 'time', 'science'],
    description: 'The ibis-headed Egyptian god of writing, magic, science, and wisdom. Thoth invented hieroglyphics and recorded the judgment of souls in the Hall of Ma\'at. He is credited with writing forty-two books of divine knowledge — the Hermetic tradition claims he was the original Hermes Trismegistus.',
    attributes: ['ibis head', 'writing palette', 'lunar disc', 'scales of Ma\'at', 'forty-two books'],
    relationships: [
      { entityId: 'hermes-god', relationship: 'Greek correspondence' },
      { entityId: 'metatron', relationship: 'divine scribe parallel' },
      { entityId: 'ma-at', relationship: 'colleague — divine law and order' },
    ],
    akashicLinks: ['egyptian-magic', 'hermetic-corpus', 'emerald-tablet', 'akashic-record'],
    sigil: '𓏏',
  },
  {
    id: 'kali',
    name: 'Kali',
    type: 'deity',
    tradition: ['Hinduism', 'Tantra', 'Shakta Tradition'],
    domains: ['time', 'destruction', 'liberation', 'death', 'dark feminine', 'transformation'],
    description: 'The terrifying and liberating black goddess. Kali stands on the supine body of Shiva, her tongue out, garland of skulls around her neck, severed head in hand. She is time devouring all things — and in that devouring, liberating them from the illusion of permanence. Her darkness is mercy for those brave enough to receive it.',
    attributes: ['blue-black skin', 'four arms', 'skulls', 'sword', 'tongue out', 'wild hair', 'Shiva beneath her feet'],
    relationships: [
      { entityId: 'lilith', relationship: 'dark feminine goddess parallel' },
      { entityId: 'hecate', relationship: 'dark goddess parallel' },
      { entityId: 'matangi-entity', relationship: 'sister Mahavidya' },
    ],
    akashicLinks: ['death-tarot', 'dark-night-of-soul', 'alchemical-nigredo', 'tantra', 'shadow-work'],
    sigil: '🗡',
  },
  {
    id: 'lucifer',
    name: 'Lucifer / The Light-Bearer',
    type: 'demon',
    tradition: ['Christianity', 'Gnosticism', 'Modern Occultism', 'Thelema'],
    domains: ['light', 'knowledge', 'rebellion', 'liberation', 'the morning star', 'pride'],
    description: 'The most misrepresented figure in Western occultism. Lucifer (Latin: light-bearer) was originally the planet Venus as the morning star. In Gnostic thought, the Demiurge who created the material world was the tyrant — and Lucifer, by offering knowledge, was the liberator. Modern occultists reclaim him as the symbol of intellectual light, sovereignty of the individual, and sacred transgression.',
    attributes: ['morning star', 'Venus', 'fallen angel', 'serpent of knowledge', 'the adversary'],
    relationships: [
      { entityId: 'prometheus', relationship: 'mythological parallel — the bringer of divine fire' },
      { entityId: 'metatron', relationship: 'counterpart — light above and below' },
      { entityId: 'samael', relationship: 'Kabbalistic identification' },
    ],
    akashicLinks: ['gnostic-cosmology', 'prometheus-myth', 'the-devil-tarot', 'adversarial-path', 'venus-mythology'],
    sigil: '★',
  },
  {
    id: 'odin',
    name: 'Odin / Wotan',
    type: 'deity',
    tradition: ['Norse', 'Germanic', 'Runes'],
    domains: ['wisdom', 'death', 'poetry', 'war', 'runes', 'shamanism', 'self-sacrifice'],
    description: 'The Allfather who hung himself on the World Tree for nine days and nights to receive the runes. Odin gave one eye at Mimir\'s well for cosmic wisdom. He wanders incognito among mortals, collecting knowledge. His two ravens Huginn (thought) and Muninn (memory) fly across the nine worlds each day and return to report.',
    attributes: ['one eye', 'wide-brimmed hat', 'staff', 'two ravens', 'eight-legged horse', 'spear Gungnir'],
    relationships: [
      { entityId: 'hermes-god', relationship: 'psychopomp and trickster parallel' },
      { entityId: 'thoth', relationship: 'god of wisdom and writing parallel' },
    ],
    akashicLinks: ['rune-magic', 'shamanic-initiation', 'world-tree-yggdrasil', 'the-hanged-man-tarot', 'self-sacrifice'],
    sigil: 'ᚢ',
  },
];

export const ENTITY_TYPES = ['angel', 'demon', 'deity', 'spirit', 'archetype', 'mythological'] as const;
export const ENTITY_TRADITIONS = [
  'Greek', 'Roman', 'Egyptian', 'Norse', 'Kabbalah', 'Hindu', 'Hermetic', 'Christian', 'Gnostic', 'Enochian',
];
