export type VerificationVerdict = 
  | 'AUTHENTIC'
  | 'AUTHENTIC_REENCODED'
  | 'AUTHENTIC_PLATFORM_COPY'
  | 'UNVERIFIED';

export type VerificationMethod = 'sha256' | 'phash' | 'watermark' | null;

export interface Artifact {
  id: string;
  filename: string;
  content_type: string;
  sha256: string;
  phash?: string;
  wm_id?: string;
  merkle_proof?: string;
  merkle_root?: string;
  ledger_tx?: string;
  size_bytes?: number;
  registered_at: number;
  registered_by: string;
}

export interface VerificationResponse {
  verdict: VerificationVerdict;
  method: VerificationMethod;
  artifact_id: string | null;
  detail: string;
  artifact?: Artifact;
  verified_at: number;
  content_url: string;
  content_type_detected: string;
  confidence?: number;
}
