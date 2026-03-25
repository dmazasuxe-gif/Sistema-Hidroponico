/* eslint-disable react/forbid-dom-props */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plant = searchParams.get('plant') || 'LECHUGA ROMANA';
  const harvest = searchParams.get('harvest') || 'HOY';
  const days = searchParams.get('days') || '45';
  const origin = searchParams.get('origin') || 'Jepelacio Moyobamba';
  const company = searchParams.get('company') || 'HIDROJEPE';
  
  const dateObj = new Date(harvest);
  const formattedDay = isNaN(dateObj.getTime()) ? harvest : dateObj.getDate().toString();
  const formattedMonthYear = isNaN(dateObj.getTime()) ? '' : `${dateObj.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${dateObj.getFullYear()}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#093626', // Fondo principal
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        {/* Borde exterior metálico simulado */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            border: '6px solid #8ba49a',
            borderRadius: '50px',
            padding: '6px',
            alignItems: 'center',
          }}
        >
           {/* Borde interno */}
           <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              border: '2px solid #577065',
              borderRadius: '40px',
              padding: '60px',
              alignItems: 'center',
              backgroundColor: '#063020',
              backgroundImage: 'linear-gradient(to bottom, #0a3d2b, #042416)',
            }}
          >
            {/* Header / Logo Section */}
            <img 
              src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f96c.png" 
              alt="Lettuce Logo"
              width="200" 
              height="200" 
              style={{ marginBottom: '20px' }} 
            />
            <h1 style={{ fontSize: 75, letterSpacing: '8px', color: '#ffffff', fontWeight: 'bold', margin: 0 }}>
              {company.toUpperCase()}
            </h1>
            <p style={{ fontSize: 30, letterSpacing: '4px', color: '#56c68a', marginTop: '15px', marginBottom: '80px', textTransform: 'uppercase' }}>
              Cultivos Frescos
            </p>

            {/* Plant Name */}
            <h2 style={{ fontSize: 110, letterSpacing: '4px', color: '#ffffff', fontWeight: 'bold', margin: '0 0 15px 0', textTransform: 'uppercase', textAlign: 'center' }}>
              {plant.replace(' Premium', '')}
            </h2>
            <p style={{ fontSize: 50, color: '#e5e7eb', fontStyle: 'italic', margin: '0 0 100px 0', fontFamily: 'serif' }}>
              Premium Selection
            </p>

            {/* Badge Circular */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '650px',
                height: '650px',
                borderRadius: '500px',
                backgroundColor: '#cbd5e1', // Borde plata externo
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  borderRadius: '500px',
                  backgroundColor: '#ffffff', // Borde plata interno
                  padding: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: '500px',
                    backgroundImage: 'linear-gradient(to bottom, #2da285, #196f57)',
                    border: '4px solid #0f4b39',
                  }}
                >
                  <span style={{ fontSize: 45, color: '#a7f3d0', letterSpacing: '4px', marginTop: '20px' }}>COSECHADA EL</span>
                  <span style={{ fontSize: 250, color: '#e5e7eb', fontWeight: 'bold', lineHeight: 1, margin: '-10px 0', textShadow: '4px 8px 10px rgba(0,0,0,0.4)' }}>
                    {formattedDay}
                  </span>
                  <span style={{ fontSize: 45, color: '#ffffff', letterSpacing: '4px', marginBottom: '20px' }}>{formattedMonthYear}</span>
                </div>
              </div>
            </div>

            {/* Spacer */}
            <div style={{ display: 'flex', flexGrow: 1 }} />

            {/* Fila divisoria inferior */}
            <div style={{ display: 'flex', width: '90%', borderBottom: '2px solid #577065', marginBottom: '40px' }} />

            {/* Columnas Inferiores */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 20px' }}>
              
              {/* Origen */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ fontSize: 35, color: '#a7f3d0', letterSpacing: '2px' }}>ORIGEN:</span>
                </div>
                <span style={{ fontSize: 45, color: '#ffffff', textAlign: 'center', display: 'flex' }}>Jepelacio<br/>Moyobamba</span>
              </div>

              {/* Cultivo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span style={{ fontSize: 35, color: '#a7f3d0', letterSpacing: '2px' }}>CULTIVO:</span>
                </div>
                <span style={{ fontSize: 45, color: '#ffffff', textAlign: 'center', display: 'flex' }}>{days} días<br/>(FRESCA)</span>
              </div>

              {/* Nutrición */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
                    <path d="M5.52 16h12.96" />
                  </svg>
                  <span style={{ fontSize: 35, color: '#a7f3d0', letterSpacing: '2px' }}>NUTRICIÓN:</span>
                </div>
                <span style={{ fontSize: 45, color: '#ffffff', textAlign: 'center', display: 'flex', marginTop: '18px' }}>100% Pura</span>
              </div>

            </div>
           </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
