/* eslint-disable react/forbid-dom-props */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plant = searchParams.get('plant') || 'Producto Premium';
  const harvest = searchParams.get('harvest') || 'HOY';
  const days = searchParams.get('days') || '45';
  const origin = searchParams.get('origin') || 'Granja Local';
  const company = searchParams.get('company') || 'HIDRO JEPE';
  
  // Parse date roughly
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
          backgroundColor: '#022c22', // Emerald-950
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Decorative background overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(180deg, #064e3b 0%, #022c22 100%)', zIndex: 0 }} />

        {/* Content Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
            height: '92%',
            padding: '80px 40px',
            backgroundColor: 'rgba(6, 95, 70, 0.4)', // Emerald bg
            borderRadius: '60px',
            border: '8px solid rgba(52, 211, 153, 0.3)',
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px' }}>
             <span style={{ fontSize: 130, marginBottom: '20px' }}>🥬</span>
             <h1 style={{ fontSize: 80, fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', margin: 0, padding: 0 }}>{company}</h1>
             <span style={{ fontSize: 35, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '10px' }}>Cultivos Frescos</span>
          </div>

          {/* Plant Name */}
          <h2 style={{ fontSize: 120, fontWeight: '900', color: '#ffffff', textAlign: 'center', textTransform: 'capitalize', lineHeight: '1.1', marginBottom: '120px', letterSpacing: '-0.02em', padding: '0 40px' }}>
            {plant.replace(' Premium', '')}
          </h2>

          {/* Huge Badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#10b981', // Emerald-500
              borderRadius: '500px',
              width: '600px',
              height: '600px',
              border: '25px solid #ffffff',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <span style={{ fontSize: 45, fontWeight: '900', textTransform: 'uppercase', color: '#ecfdf5', letterSpacing: '0.1em', marginBottom: '20px' }}>Cosechada El</span>
            <span style={{ fontSize: 180, fontWeight: '900', color: '#ffffff', lineHeight: 1, marginBottom: '20px' }}>{formattedDay}</span>
            <span style={{ fontSize: 50, fontWeight: '900', color: '#ecfdf5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formattedMonthYear}</span>
          </div>

          {/* Spacer */}
          <div style={{ display: 'flex', flexGrow: 1 }} />

          {/* Lower Columns */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 60px', marginTop: '40px', borderTop: '4px dashed rgba(52, 211, 153, 0.4)', paddingTop: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 35, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px' }}>Origen</span>
              <span style={{ fontSize: 55, fontWeight: 'bold', color: '#ffffff' }}>{origin}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 35, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px' }}>Cultivo</span>
              <span style={{ fontSize: 55, fontWeight: 'bold', color: '#ffffff' }}>{days} días</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 35, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px' }}>Nutrición</span>
              <span style={{ fontSize: 55, fontWeight: 'bold', color: '#ffffff' }}>100% Pura</span>
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
