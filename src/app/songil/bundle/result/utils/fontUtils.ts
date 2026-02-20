
const fontCache: { [key: string]: string } = {};

export async function getPretendardFontCSS() {
  if (fontCache['Pretendard']) {
    return fontCache['Pretendard'];
  }

  const fontFiles = [
    { url: '/fonts/Pretendard-Regular.woff2', weight: 400 },
    { url: '/fonts/Pretendard-SemiBold.woff2', weight: 600 },
    { url: '/fonts/Pretendard-Bold.woff2', weight: 700 },
  ];

  try {
    const fontFaces = await Promise.all(
      fontFiles.map(async (font) => {
        const response = await fetch(font.url);
        const blob = await response.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(`
              @font-face {
                font-family: 'Pretendard';
                font-style: normal;
                font-weight: ${font.weight};
                src: url('${base64data}') format('woff2');
              }
            `);
          };
          reader.readAsDataURL(blob);
        });
      })
    );

    const css = fontFaces.join('\n');
    fontCache['Pretendard'] = css;
    return css;
  } catch (error) {
    console.error('Failed to load fonts:', error);
    return '';
  }
}
