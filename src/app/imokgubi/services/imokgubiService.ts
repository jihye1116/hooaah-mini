import { compressImage } from '@/app/imokgubi/utils/imageProcessor';

export const uploadImage = async (imageSrc: string): Promise<string> => {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  if (!backendBase) {
    throw new Error('BACKEND_BASE environment variable is not set');
  }

  const response = await fetch(imageSrc);
  const blob = await response.blob();
  const compressedBlob = await compressImage(blob);

  const formData = new FormData();
  const timestamp = Date.now();
  formData.append('image', compressedBlob, `compressed_image_${timestamp}.jpg`);

  const uploadResponse = await fetch(`${backendBase}/upload/physiognomy`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  if (uploadResponse.status === 201) {
    const imageUrl = await uploadResponse.text();
    console.log('Uploaded Image URL:', imageUrl);
    return imageUrl;
  } else {
    throw new Error('Image upload failed');
  }
};

export const analyzeImage = async (
  imageUrl: string,
  contentsType: string,
): Promise<string> => {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  if (!backendBase) {
    throw new Error('BACKEND_BASE environment variable is not set');
  }

  console.log('contentsType in analyzeImage:', contentsType);

  const apiUrl = `${backendBase}/openai/physiognomy?imageUrl=${encodeURIComponent(imageUrl)}&category=${contentsType}&language=ko`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Failed to get physiognomy result: ${response.status}`);
  }

  const resultText = await response.text();
  console.log('Physiognomy Result:', resultText);

  try {
    const resultJson = JSON.parse(resultText);
    if (resultJson.error === true) {
      console.warn('분석 오류:', resultJson.errorText);
    }
  } catch (e) {
    if (!(e instanceof SyntaxError)) {
      throw e;
    }
  }

  return resultText;
};

export const analyzePairImage = async (
  imageUrl1: string,
  imageUrl2: string,
  contentsType: string,
): Promise<string> => {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE;
  if (!backendBase) {
    throw new Error('BACKEND_BASE environment variable is not set');
  }

  console.log('contentsType in analyzePairImage:', contentsType);

  const apiUrl = `${backendBase}/openai/physiognomy?imageUrl=${encodeURIComponent(imageUrl1)}&secondImageUrl=${encodeURIComponent(imageUrl2)}&category=${contentsType}&language=ko`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(
      `Failed to get pair physiognomy result: ${response.status}`,
    );
  }

  const resultText = await response.text();
  console.log('Pair Physiognomy Result:', resultText);

  try {
    const resultJson = JSON.parse(resultText);
    if (resultJson.error === true) {
      console.warn('분석 오류:', resultJson.errorText);
    }
  } catch (e) {
    if (!(e instanceof SyntaxError)) {
      throw e;
    }
  }

  return resultText;
};
