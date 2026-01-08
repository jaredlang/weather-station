/**
 * Decodes a base64-encoded WAV audio string into a Blob URL that can be played
 * @param base64 - Base64 encoded audio data (with or without data URL prefix)
 * @returns Object URL pointing to the audio blob
 */
export const decodeBase64Audio = (base64: string): string => {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:audio\/wav;base64,/, '');

  // Decode base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create blob
  const blob = new Blob([bytes], { type: 'audio/wav' });

  // Return object URL
  return URL.createObjectURL(blob);
};
