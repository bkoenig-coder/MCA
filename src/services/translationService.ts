export async function translateContent(text: string, targetLang: 'en' | 'mn' | 'de'): Promise<string> {
  if (!text) return text;
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // The translated text is returned as an array of sentence segments
    const translatedText = data[0].map((item: any) => item[0]).join('');
    
    return translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text on error
  }
}

export async function autoTranslateRecord(record: any, fieldsToTranslate: string[]): Promise<any> {
  const newRecord = { ...record };
  
  for (const field of fieldsToTranslate) {
    if (newRecord[field]) {
      const en = await translateContent(newRecord[field], 'en');
      const mn = await translateContent(newRecord[field], 'mn');
      const de = await translateContent(newRecord[field], 'de');
      
      newRecord[`${field}En`] = en;
      newRecord[`${field}Mn`] = mn;
      newRecord[`${field}De`] = de;
    }
  }
  
  return newRecord;
}
