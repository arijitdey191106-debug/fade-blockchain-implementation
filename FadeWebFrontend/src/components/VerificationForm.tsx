import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { verifyContent, APIError } from '../services/verificationApi';
import type { VerificationResponse } from '../types/verification';

interface Props {
  onVerifyResult: (result: VerificationResponse) => void;
  onClear: () => void;
}

export const VerificationForm: React.FC<Props> = ({ onVerifyResult, onClear }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setError('Please enter a valid full http/https URL');
      return;
    }

    setLoading(true);
    setError(null);
    onClear();

    try {
      const result = await verifyContent(trimmedUrl);
      onVerifyResult(result);
    } catch (err: any) {
      setError(err instanceof APIError ? err.message : (err.message || 'An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="contentUrl" className="text-sm font-medium text-zinc-300">
            Paste public content URL
          </label>
          <p className="text-xs text-zinc-500 mb-2">
            Enter a direct media URL (e.g., direct image/video link) or a supported platform URL.
          </p>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="text"
              id="contentUrl"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
              className="block w-full pl-10 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50 outline-none"
              placeholder="https://example.com/video.mp4"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full py-4 px-6 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying content...
            </>
          ) : (
            'VERIFY CONTENT'
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-8 text-center animate-in fade-in duration-500">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-zinc-900/50 border border-zinc-800 mb-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-zinc-200">Analysis in Progress</h3>
          <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto space-y-1 flex flex-col">
            <span>• Downloading public content</span>
            <span>• Computing/validating integrity</span>
            <span>• Checking verification record</span>
          </p>
        </div>
      )}
    </div>
  );
};
