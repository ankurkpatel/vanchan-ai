import { useState, useRef, useEffect } from 'react';

export function useScopeBook() {

interface Book {
    book: string;
    id: string;
}
      
const books = [
    { book: 'Std. 10 Math', id: 'VoA4LyHlqM-QXp92s2kLA' },
    { book: 'Std. 11 Chemistry', id: '7OLqlSMpuDmDQDn9X0RDh' },
    { book: 'Std. 10 Science', id: 'pkiDCS38MKfyPQdt0x30-' },
    { book: 'Std. 12 Biology', id: 'iCpboeqPDTZ-4njSCTe_9' },
    {book:'std 10 Social Science', id: 'EsJO9Y0bOfQ1BpJStmpdH' }
]
      

const [selectedScope, setSelectedScope] = useState<Book | undefined>();
  const [isShowSelection, setIsShowSelection] = useState(true);

  const handleScopeChange = (value: string) => {
    const selectedBookObj = books.find(book => book.id === value);
    setSelectedScope(selectedBookObj);
    setIsShowSelection(false);
    console.log(`Selected book: ${selectedBookObj?.book}`);
  };

  return {
    selectedScope,
    books,
    isShowSelection
  };
}