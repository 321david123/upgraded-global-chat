// utils/formatTimestamp.ts

export const formatTimestamp = (timestamp: Date | null): string => {
    if (!timestamp) return '';
    
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long', // Puedes usar 'numeric' o 'short' según prefieras
      year: 'numeric',
    };
    
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Usa formato de 24 horas
    };
    
    const date = timestamp.toLocaleDateString(undefined, optionsDate);
    const time = timestamp.toLocaleTimeString(undefined, optionsTime);
    
    return `${date} at ${time}`;
  };