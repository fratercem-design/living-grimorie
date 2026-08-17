import { ImageResponse } from 'next/og';

export const alt = 'The Living Grimoire — enter the digital grimoire, seven chambers await';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Drawn from the site's own palette (globals.css): magenta #ff00cc, cyan #00e5ff,
// gold #ffd700 on the void #05010a. Generated rather than sourced so there is no
// third-party image licence attached to the social preview.
export default function OpengraphImage() {
  const seven = [0, 1, 2, 3, 4, 5, 6];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#05010a',
          backgroundImage:
            'radial-gradient(circle at 20% 18%, rgba(255,0,204,0.30), transparent 45%), radial-gradient(circle at 82% 78%, rgba(0,229,255,0.26), transparent 48%), radial-gradient(circle at 50% 50%, rgba(26,0,48,0.85), transparent 70%)',
          position: 'relative',
        }}
      >
        {/* seven marks — one per chamber */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 44 }}>
          {seven.map((i) => (
            <div
              key={i}
              style={{
                width: i === 3 ? 15 : 9,
                height: i === 3 ? 15 : 9,
                marginLeft: i === 0 ? 0 : 22,
                borderRadius: 99,
                backgroundColor: i === 3 ? '#ffd700' : i % 2 === 0 ? '#ff00cc' : '#00e5ff',
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 82,
            letterSpacing: 14,
            color: '#ffffff',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          THE LIVING GRIMOIRE
        </div>

        <div
          style={{
            display: 'flex',
            width: 300,
            height: 2,
            marginTop: 40,
            marginBottom: 36,
            backgroundImage: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 31,
            letterSpacing: 7,
            color: '#e8d5ff',
            textAlign: 'center',
          }}
        >
          SEVEN CHAMBERS AWAIT
        </div>

        {/* framing rule */}
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 34,
            right: 34,
            bottom: 34,
            display: 'flex',
            border: '1px solid rgba(255,0,204,0.30)',
          }}
        />
      </div>
    ),
    size,
  );
}
