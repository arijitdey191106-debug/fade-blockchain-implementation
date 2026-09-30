import { useState } from 'react';
import { VerificationForm } from './components/VerificationForm';
import { VerificationResult } from './components/VerificationResult';
import type { VerificationResponse } from './types/verification';
import { Shield } from 'lucide-react';

function App() {
  const [result, setResult] = useState<VerificationResponse | null>(null);

  const handleVerifyResult = (newResult: VerificationResponse) => {
    setResult(newResult);
  };

  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 selection:bg-blue-500/30">
      <header className="w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <Shield className="w-6 h-6 text-zinc-100" />
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">FADE</h1>
          <span className="text-zinc-500 text-sm font-medium border-l border-zinc-800 pl-3">
            Content Verification
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        <div className="text-center mb-8 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 mb-4">
            Verify the authenticity of FADE-generated content.
          </h2>
          <p className="text-zinc-400 text-lg">
            Ensure that digital media is original, unmanipulated, and securely registered on our decentralized ledger.
          </p>
        </div>

        <VerificationForm onVerifyResult={handleVerifyResult} onClear={handleClear} />

        {result && (
          <VerificationResult result={result} />
        )}
      </main>

      <footer className="w-full py-6 text-center border-t border-zinc-900 mt-auto">
        <p className="text-xs text-zinc-600">
          Powered by FADE Verification Network. The backend is the source of truth for verification.
        </p>
      </footer>
    </div>
  );
}

export default App;
