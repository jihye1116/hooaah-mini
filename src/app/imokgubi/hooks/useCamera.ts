import { useRef, useEffect } from 'react';

interface UseCameraProps {
  facingMode: 'user' | 'environment';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  onError: (error: string) => void;
}

export const useCamera = ({
  facingMode,
  videoRef,
  enabled,
  onError,
}: UseCameraProps) => {
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        // 기존 스트림 정리
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: false,
        });

        currentStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera Error:', err);
        onError('카메라 권한을 확인해주세요.');
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, enabled, videoRef, onError]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  return { streamRef, stopStream };
};
