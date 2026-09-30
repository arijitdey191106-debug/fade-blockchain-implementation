import React from 'react';
import type { VerificationResponse } from '../types/verification';
import { CheckCircle, XCircle, AlertCircle, Info, ShieldCheck, FileText, Fingerprint, Database, ExternalLink } from 'lucide-react';

interface Props {
  result: VerificationResponse;
}

export const VerificationResult: React.FC<Props> = ({ result }) => {
  const { verdict, detail, artifact, verified_at, method, content_type_detected } = result;

  const getVerdictStyle = () => {
    switch (verdict) {
      case 'AUTHENTIC':
      case 'AUTHENTIC_REENCODED':
      case 'AUTHENTIC_PLATFORM_COPY':
        return 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400';
      case 'UNVERIFIED':
        return 'bg-red-950/30 border-red-500/50 text-red-400';
      default:
        return 'bg-zinc-900 border-zinc-700 text-zinc-400';
    }
  };

  const getVerdictIcon = () => {
    switch (verdict) {
      case 'AUTHENTIC':
        return <CheckCircle className="w-8 h-8 text-emerald-500" />;
      case 'AUTHENTIC_REENCODED':
      case 'AUTHENTIC_PLATFORM_COPY':
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case 'UNVERIFIED':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-zinc-500" />;
    }
  };

  const formatTitle = (v: string) => {
    switch (v) {
      case 'AUTHENTIC': return 'Verified Authentic';
      case 'AUTHENTIC_REENCODED': return 'Verified (Re-encoded)';
      case 'AUTHENTIC_PLATFORM_COPY': return 'Verified (Platform Copy)';
      case 'UNVERIFIED': return 'Not Verified';
      default: return v;
    }
  };

  const isSuccess = verdict.startsWith('AUTHENTIC');

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleString();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`rounded-xl border p-6 flex flex-col gap-6 ${getVerdictStyle()}`}>
        
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="mt-1">{getVerdictIcon()}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight mb-1">
              {formatTitle(verdict)}
            </h2>
            {result.confidence !== undefined && (
              <div className="text-lg font-semibold mb-2 tracking-wide">
                Match Confidence: {result.confidence}%
              </div>
            )}
            <p className="text-sm opacity-90">{detail}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-lg flex items-center gap-3">
            <Info className="w-5 h-5 opacity-70" />
            <div>
              <p className="text-xs opacity-70 font-semibold uppercase tracking-wider">Detection Method</p>
              <p className="text-sm font-medium">{method || 'None'}</p>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg flex items-center gap-3">
            <FileText className="w-5 h-5 opacity-70" />
            <div>
              <p className="text-xs opacity-70 font-semibold uppercase tracking-wider">Content Type</p>
              <p className="text-sm font-medium">{content_type_detected}</p>
            </div>
          </div>
        </div>

        {/* Artifact Details */}
        {isSuccess && artifact && (
          <div className="mt-4 border-t border-current/20 pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Registered Artifact Data
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-current/10 pb-2">
                <span className="text-xs opacity-70 uppercase tracking-wider font-semibold">Filename</span>
                <span className="text-sm font-mono break-all">{artifact.filename || 'Unknown'}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-current/10 pb-2">
                <span className="text-xs opacity-70 uppercase tracking-wider font-semibold">Registered At</span>
                <span className="text-sm">{formatDate(artifact.registered_at)}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-current/10 pb-2">
                <span className="text-xs opacity-70 uppercase tracking-wider font-semibold">Artifact ID</span>
                <span className="text-sm font-mono break-all text-current/80">{artifact.id}</span>
              </div>

              {artifact.sha256 && (
                <div className="flex flex-col gap-1 border-b border-current/10 pb-2">
                  <span className="text-xs opacity-70 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" /> Original SHA-256
                  </span>
                  <span className="text-xs font-mono break-all text-current/80">{artifact.sha256}</span>
                </div>
              )}

              {artifact.ledger_tx && (
                <div className="flex flex-col gap-1 border-b border-current/10 pb-2">
                  <span className="text-xs opacity-70 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Blockchain Ledger TX
                  </span>
                  <span className="text-xs font-mono break-all text-current/80">{artifact.ledger_tx}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs opacity-50 text-center mt-2">
          Verified at {formatDate(verified_at)}
        </div>
      </div>
    </div>
  );
};
