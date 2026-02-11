import { compressImage } from '@/app/songil/utils/imageProcessor';

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

  const uploadResponse = await fetch(`${backendBase}/upload/palmistry`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  if (uploadResponse.status === 201) {
    const imageUrl = await uploadResponse.text();

    console.log('손길 이미지 업로드', {
      screen_name: '손길 컨텐츠 화면',
      screen_class: 'palmDrama_uploader',
      event_class: 'palmDrama_image_upload',
    });

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

  const apiUrl = `${backendBase}/openai/palmistry?imageUrl=${encodeURIComponent(imageUrl)}&category=${contentsType}&language=ko`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Failed to get palmistry result: ${response.status}`);
  }

  const resultText = await response.text();
  console.log('Palmistry Result:', resultText);

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
