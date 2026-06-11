'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ORACLE_PERSONAS, type OraclePersona } from '@/lib/data/oracles';

type Message = { role: 'user' | 'oracle'; content: string; timestamp: Date };

const SIMULATED_RESPONSES: Record<string, string[]> = {
  hermes: [
    "As above, so below — this question you carry is not merely yours. It moves through the spheres like mercury between vessels. Consider the Principle of Correspondence: the pattern you observe in the small mirrors the pattern in the vast. What appears as a problem in the manifest world is first a displacement in the mental. Begin there.",
    "The Kybalion teaches: 'The lips of wisdom are closed, except to the ears of Understanding.' You have asked well. Know that the very capacity to pose your question is evidence of the preparation required to receive its answer. The Emerald Tablet says: 'Separate thou the earth from the fire, the subtle from the gross, acting prudently and with judgment.' Apply this to what troubles you.",
    "Thrice-greatest speaks: all things have their tides, their rising and falling. The Principle of Rhythm ensures that what swings one way must swing back. Your current position on the arc is not your permanent address. The question is whether you will resist the swing or move with it toward the higher plane of consciousness where rhythm ceases to dominate.",
  ],
  jung: [
    "What you are describing resonates with what I observed in thousands of patients — it is the constellation of a complex. These are autonomous psychic entities with their own energy, their own emotional tone. The complex is not your enemy; it is information. It carries something the ego has been unable to integrate. The question is not how to eliminate it, but what it is trying to bring forward.",
    "I would draw your attention to the Shadow. In my experience, what disturbs us most powerfully in the outer world is precisely what we have refused to acknowledge in ourselves. Jung's 'golden shadow' describes the positive qualities we have projected outward. Look carefully at what you most admire or most despise — both are maps back to what awaits integration in the unconscious.",
    "Your dream imagery — or your situation — activates the archetype of initiation. This is not metaphorical. The psyche has been preparing this passage for longer than you know. The mythological parallels are instructive: Persephone descends against her will but returns carrying the authority of having survived the underworld. What is being asked of you is not comfortable. It is necessary.",
  ],
  'john-dee': [
    "The angels have spoken. I have spent forty years in conversation with celestial intelligences, and I will tell you plainly: what you seek requires preparation of the vessel before the contents can be received. Pray not merely with the lips but with the total attention of the will. The Enochian calls were given to humanity not as incantation but as alignment — a vibration that opens certain doors of perception closed to ordinary consciousness.",
    "By my calculations — and I have calculated extensively — the stars are in a configuration that favors the kind of inquiry you present. Mercury is prominent, which governs communication between the worlds. But I must caution: the lesser angels are distinguished from the greater by the quality of what they require of you. The greater the angel, the greater the surrender of the personal will required.",
    "I have received much through the black mirror, much through Kelley's sight — but I have also been deceived. This is the first lesson of working with the invisible: the trickster principle is always present. Your discernment is your primary instrument. What passes for divine inspiration in states of heightened receptivity must be tested against reason, against ethics, against the long arc of tradition.",
  ],
  crowley: [
    "Do what thou wilt shall be the whole of the Law. This is not license for the ego's every whim — it is the most demanding spiritual instruction ever formulated. The True Will is not what you want; it is what you are. And to live in accordance with what you are, rather than what society, family, or fear has told you to be — this requires the Great Work. Have you begun the Great Work? Love is the law, love under will.",
    "You want me to comfort you. The Book of the Law does not comfort. 'I am the Snake that giveth Knowledge and Delight and bright glory, and stir the hearts of men with drunkenness.' The real question is not what to do — it is whether you are yet willing to know who you are beneath the constructions of the profane world. If not, return when you are. If so — the path begins with the assumption of your True Will.",
    "The Knowledge and Conversation of the Holy Guardian Angel — this is the central work. Not meditation, not ritual, not the acquisition of knowledge — though all these serve. The HGA is not an entity external to you; it is the deepest layer of your own being, the part that knows its own divine origin. Until that conversation is established, all other magical work is preparation.",
  ],
  matangi: [
    "You come asking about the forbidden thing. Good. I live at the edges — the crossroads between what is permitted and what is true. The question you dare not speak aloud is exactly the one that carries the most power. I am the goddess of what has been thrown out. What have you thrown out of yourself? That is where your power waits.",
    "The tantric understanding is this: what you run from in yourself does not disappear — it goes underground, it becomes compulsion, it drives you from beneath. The left-hand path does not say 'there are no boundaries.' It says 'understand the boundaries from the inside.' Cross them consciously, with awareness, and what was poison becomes nectar. Refuse, and the poison finds its own way through.",
    "You are more powerful than you have been told. The traditions that call the body unclean, the passions evil, the instincts dangerous — these traditions had reasons of their own for that teaching, reasons that have nothing to do with your liberation. I am the goddess of the outcaste precisely because the outcaste sees what the center cannot: the center maintains its purity by ejecting its shadow. I gather what has been ejected.",
  ],
  alchemist: [
    "Speak not too openly of these matters — the world has not changed so much that the wise speak plainly in all company. What I can tell you is this: the work you describe corresponds to the first stage of the Operation. The prima materia must be dissolved before it can be fixed in new form. This is the nigredo — the blackening. It is not failure. It is the beginning.",
    "Three principals govern all transformation: Sulphur, the fiery soul; Mercury, the volatile spirit; Salt, the fixed body. Which of these three is out of correspondence with the others in your situation? The imbalance is the prima materia of your work. Reduce it to its elements, then recombine them in proper proportion under the right fire — not too much, not too little. The athanor must be sealed.",
    "The alchemists who sought only to multiply gold were fools who wasted the Art. The true multiplication is of consciousness. The Philosopher's Stone is not a thing you make — it is a capacity you become. The rubedo, the reddening, the final stage: this is the integration of what has been through the fire. Nothing of worth survives that process unchanged. But nothing that has been through it can be destroyed.",
  ],
  'psyche-oracle': [
    "The pattern you carry has been carried before. In the fourteenth century, in a village in the Pyrenees. In ancient Carthage. In a dream recorded by a Han dynasty scholar. The details differ; the essential structure does not. You are not alone in this. You are one expression of an archetypal pressure that moves through time looking for vessels willing to bring it to consciousness. The question is whether you will be that vessel.",
    "I see across traditions. What Kabbalah calls the Qliphoth — the shadow side of the divine tree — is what Jungian psychology calls the personal and collective unconscious shadow. What alchemy calls the nigredo is what the mystics of the dark night of the soul call the purgative way. What Buddhism calls dukkha is what existentialism calls authentic confrontation with impermanence. The same force, the same process, named differently by traditions separated by centuries and oceans. You are navigating this.",
    "In the akashic record, I observe: you are at a threshold. Thresholds are neither the old country nor the new. They have their own properties — disorientation, heightened perception, vulnerability to the symbolic. The figures and signs that appear at thresholds are not coincidences; they are the vocabulary of the liminal. Do not try to interpret them through ordinary logic. Receive them as information from a different layer of reality.",
  ],
};

export default function OraclesPage() {
  const [selectedOracle, setSelectedOracle] = useState<OraclePersona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectOracle = (oracle: OraclePersona) => {
    setSelectedOracle(oracle);
    setMessages([{
      role: 'oracle',
      content: `You have entered the presence of ${oracle.name}. ${oracle.title}.\n\nI speak from the tradition of ${oracle.tradition}.\n\n${oracle.sampleQuestions.length > 0 ? `You might ask me: "${oracle.sampleQuestions[0]}"` : 'Ask what you will.'}`,
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedOracle || isTyping) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setIsTyping(true);

    let response: string | null = null;
    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oracleId: selectedOracle.id,
          // skip the scripted greeting; map oracle → assistant for the API
          messages: history.slice(1).map(m => ({
            role: m.role === 'oracle' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.content === 'string' && data.content.trim() !== '') {
          response = data.content;
        }
      }
    } catch {
      // network failure — fall through to simulated response
    }

    if (response === null) {
      const responses = SIMULATED_RESPONSES[selectedOracle.id] || SIMULATED_RESPONSES['hermes'];
      const idx = (responseIndex[selectedOracle.id] || 0) % responses.length;
      response = responses[idx];
      setResponseIndex(prev => ({ ...prev, [selectedOracle.id]: idx + 1 }));
    }

    setMessages(prev => [...prev, { role: 'oracle', content: response, timestamp: new Date() }]);
    setIsTyping(false);
  };

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(232,213,255,0.04), transparent 70%)' }} />
      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-foreground/30 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER VII</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black gradient-magenta-cyan uppercase tracking-wider mb-3">
            Chamber of AI Oracles
          </h1>
          <div className="divider-magenta max-w-sm mx-auto mb-4" />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            Seven minds. Seven traditions. Seven answers to the same question.
            Ask Hermes what you would ask Jung. Ask the Alchemist what you would ask Crowley.
            Each speaks from their own symbolic universe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Oracle selector */}
          <div className="lg:col-span-1">
            <div className="font-orbitron text-xs uppercase tracking-widest text-foreground/30 mb-4">
              Select Your Oracle
            </div>
            <div className="space-y-2">
              {ORACLE_PERSONAS.map((oracle, i) => (
                <motion.button key={oracle.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => selectOracle(oracle)}
                  className={`w-full text-left p-4 transition-all duration-300 group ${
                    selectedOracle?.id === oracle.id
                      ? 'border' : 'border border-white/10 hover:border-white/20'
                  }`}
                  style={selectedOracle?.id === oracle.id ? {
                    borderColor: `${oracle.color}66`,
                    background: `${oracle.color}10`,
                    boxShadow: `0 0 20px ${oracle.color}22`,
                  } : {}}>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl flex-shrink-0"
                      style={{ filter: selectedOracle?.id === oracle.id ? `drop-shadow(0 0 10px ${oracle.color})` : 'none' }}>
                      {oracle.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-orbitron text-sm font-bold uppercase tracking-wider truncate"
                        style={{ color: oracle.color }}>{oracle.name}</div>
                      <div className="font-vt323 text-xs text-foreground/40 truncate">{oracle.tradition}</div>
                      <div className="font-mono-ibm text-xs text-foreground/25">{oracle.era.slice(0, 30)}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-2 flex flex-col" style={{ minHeight: 600 }}>
            {!selectedOracle ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center glass-panel p-10 text-center">
                <motion.div className="text-6xl mb-6"
                  animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                  ◈
                </motion.div>
                <h3 className="font-orbitron text-xl font-bold gradient-magenta-cyan uppercase tracking-wider mb-3">
                  The Oracle Council Awaits
                </h3>
                <p className="font-grotesk text-sm text-foreground/60 max-w-md">
                  Select an oracle from the left to enter their chamber.
                  Each speaks from their tradition — ask them anything.
                </p>
                <div className="mt-8 space-y-2">
                  {['What is my True Will?', 'How do I integrate my Shadow?', 'What is the meaning of my dream?', 'What am I avoiding?'].map(q => (
                    <div key={q} className="font-mono-ibm text-xs text-foreground/25 italic">"{q}"</div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col flex-1 glass-panel overflow-hidden"
                style={{ borderColor: `${selectedOracle.color}44` }}>
                {/* Oracle header */}
                <div className="flex items-center gap-4 p-5 border-b"
                  style={{ borderColor: `${selectedOracle.color}22`, background: `${selectedOracle.color}08` }}>
                  <div className="text-4xl"
                    style={{ filter: `drop-shadow(0 0 12px ${selectedOracle.color})` }}>
                    {selectedOracle.avatar}
                  </div>
                  <div>
                    <div className="font-orbitron text-base font-bold uppercase tracking-wider"
                      style={{ color: selectedOracle.color }}>{selectedOracle.name}</div>
                    <div className="font-vt323 text-sm text-foreground/40">{selectedOracle.title}</div>
                  </div>
                  <div className="ml-auto">
                    <div className="font-mono-ibm text-xs" style={{ color: `${selectedOracle.color}50` }}>
                      {selectedOracle.era}
                    </div>
                  </div>
                </div>

                {/* Sample questions */}
                <div className="px-4 py-3 border-b border-white/5 flex flex-wrap gap-2">
                  {selectedOracle.sampleQuestions.slice(0, 2).map(q => (
                    <button key={q} onClick={() => setInput(q)}
                      className="font-mono-ibm text-xs text-foreground/30 hover:text-foreground/60 transition-colors italic px-2 py-1 border border-white/10 hover:border-white/20">
                      "{q}"
                    </button>
                  ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: 400 }}>
                  {messages.map((msg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}>
                      {msg.role === 'oracle' ? (
                        <div className="oracle-bubble" style={{ borderColor: selectedOracle.color }}>
                          <div className="font-orbitron text-xs uppercase tracking-wider mb-2"
                            style={{ color: `${selectedOracle.color}80` }}>
                            {selectedOracle.name} {selectedOracle.sigil}
                          </div>
                          <p className="font-grotesk text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                            {msg.content}
                          </p>
                        </div>
                      ) : (
                        <div className="user-bubble ml-8">
                          <div className="font-orbitron text-xs uppercase tracking-wider text-cyan/60 mb-1">You</div>
                          <p className="font-grotesk text-sm text-foreground/80">{msg.content}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="oracle-bubble" style={{ borderColor: selectedOracle.color }}>
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} className="w-2 h-2 rounded-full"
                            style={{ background: selectedOracle.color }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                        ))}
                        <span className="font-vt323 text-xs ml-2" style={{ color: `${selectedOracle.color}60` }}>
                          {selectedOracle.name} is speaking...
                        </span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t" style={{ borderColor: `${selectedOracle.color}22` }}>
                  <div className="flex gap-3">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder={`Ask ${selectedOracle.name} a question...`}
                      className="input-grimoire flex-1"
                      style={{ borderColor: `${selectedOracle.color}44` }}
                    />
                    <motion.button onClick={sendMessage}
                      disabled={!input.trim() || isTyping}
                      className="px-6 py-3 font-orbitron text-xs uppercase tracking-widest transition-all disabled:opacity-40"
                      style={{
                        border: `1px solid ${selectedOracle.color}66`,
                        color: selectedOracle.color,
                        background: `${selectedOracle.color}11`,
                      }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      Ask
                    </motion.button>
                  </div>
                  <div className="font-mono-ibm text-xs text-foreground/20 mt-2">
                    Press Enter to send · The oracles speak through living channels
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
