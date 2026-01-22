import ApiExample from '@/components/ApiExample';

export const metadata = {
  title: 'API Demo - Frontend/Backend Integration',
  description: 'Demonstration of Next.js frontend communicating with Symfony backend',
};

export default function ApiDemoPage() {
  return (
    <main style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)',
      color: '#fff',
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem 1rem 1rem',
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #e94560 0%, #0f3460 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          API Integration Demo
        </h1>
        <p style={{ 
          color: 'rgba(255,255,255,0.6)',
          fontSize: '1.125rem',
        }}>
          Next.js Frontend ↔ Symfony Backend
        </p>
      </div>
      <ApiExample />
    </main>
  );
}

