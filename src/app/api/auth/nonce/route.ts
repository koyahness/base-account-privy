import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { nonceStore } from '@/lib/nonce-store';

export async function GET() {
  try {
    // Generate a fresh nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    nonceStore.add(nonce);
    
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}
