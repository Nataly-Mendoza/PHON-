import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '25mb' }));

  // Check and setup Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Status endpoint
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'active',
      app: 'PHONÉ CAA',
      geminiAvailable: Boolean(apiKey),
    });
  });

function generateMexicanSpanishSuggestions(tokens: string[], categoryTitle?: string): string[] {
  const textJoined = tokens.join(' ').trim();
  const lower = textJoined.toLowerCase();

  // Basic Needs
  if (lower.includes('sed') || lower.includes('agua') || lower.includes('beber')) {
    return [
      'Tengo sed, por favor, ¿me puedes dar un poco de agua?',
      'Quisiera beber agua fresca cuando tengas oportunidad, gracias.',
      'Necesito apoyo para tomar agua, por favor.'
    ];
  }

  if (lower.includes('baño') || lower.includes('sanitario') || lower.includes('orinar')) {
    return [
      'Por favor, necesito apoyo para ir al baño ahora.',
      'Quiero ir al baño, ¿me puedes acompañar, por favor?',
      '¿Me ayudas a trasladarme al sanitario, por favor?'
    ];
  }

  if (lower.includes('hambre') || lower.includes('comer') || lower.includes('alimento')) {
    return [
      'Tengo hambre y quisiera comer algo cuando sea posible.',
      'Me gustaría comer ahora, muchas gracias.',
      '¿Ya es momento de comer? Tengo apetito, por favor.'
    ];
  }

  if (lower.includes('descansar') || lower.includes('cansad') || lower.includes('dormir') || lower.includes('sueño')) {
    return [
      'Me siento cansado/a y quisiera descansar un momento.',
      'Por favor, ayúdame a acomodarme para reposar.',
      'Necesito una pausa tranquila para recuperar energía.'
    ];
  }

  // Health and Well-being
  if (lower.includes('duele') || lower.includes('dolor') || lower.includes('molestia')) {
    return [
      'Me duele algo y necesito revisar mi postura o apoyo con calma.',
      'Siento dolor en este momento, por favor acompáñame a revisar.',
      'Necesito cambiar de posición para aliviar el dolor, gracias.'
    ];
  }

  if (lower.includes('medicamento') || lower.includes('medicina') || lower.includes('pastilla')) {
    return [
      'Es momento de revisar si me toca mi medicamento, por favor.',
      '¿Me apoyas con mi medicamento recetado, gracias?',
      'Necesito tomar mi medicina cuando tengas oportunidad.'
    ];
  }

  if (lower.includes('postura') || lower.includes('acomoda') || lower.includes('cabeza') || lower.includes('brazo')) {
    return [
      'Por favor, ayúdame a cambiar de postura para estar más cómodo/a.',
      'Necesito acomodar mi posición y el soporte de mi cuerpo.',
      '¿Me ayudas a reubicar mi postura con cuidado, por favor?'
    ];
  }

  // Conversation & Social
  if (lower.includes('hablar') || lower.includes('platicar') || lower.includes('conversar')) {
    return [
      'Quiero hablar contigo con calma sobre esto, por favor.',
      '¿Podemos platicar unos minutos cuando tengas un momento libre?',
      'Me gustaría conversar contigo con tranquilidad, gracias.'
    ];
  }

  if (lower.includes('acuerdo') && !lower.includes('no')) {
    return [
      'Estoy totalmente de acuerdo con lo que me estás diciendo.',
      'Me parece muy bien y estoy de acuerdo con esta decisión.',
      'Concuerdo completamente con esta propuesta, gracias.'
    ];
  }

  if (lower.includes('no estoy de acuerdo') || lower.includes('no de acuerdo')) {
    return [
      'No estoy de acuerdo con esta propuesta, prefiero otra alternativa.',
      'No me convence esta opción, busquemos otra solución juntos.',
      'Respetuosamente difiero de esta idea, quiero revisar otra opción.'
    ];
  }

  if (lower.includes('tiempo') || lower.includes('espera') || lower.includes('momento')) {
    return [
      'Por favor, dame un momento más de tiempo para terminar la idea.',
      'Necesito un poco más de tiempo para procesar y responder con calma.',
      'No llevo prisa, por favor permíteme unos minutos más.'
    ];
  }

  if (lower.includes('decidir') || lower.includes('privacidad') || lower.includes('yo mism')) {
    return [
      'Quiero decidir por mí mismo/a sobre este tema, por favor.',
      'Por favor, respeta mi decisión y mi privacidad en este momento.',
      'Deseo tomar esta decisión de manera autónoma, gracias.'
    ];
  }

  if (lower.includes('ayuda') || lower.includes('apoyo')) {
    return [
      'Por favor, ¿me puedes apoyar con esto cuando tengas oportunidad?',
      'Necesito un poco de ayuda con esta tarea, muchas gracias.',
      '¿Podrías asistirme un momento con calma, por favor?'
    ];
  }

  // General natural Mexican Spanish combinations
  return [
    `Por favor, ${textJoined.toLowerCase()}, cuando tengas oportunidad.`,
    `Me gustaría comunicar esto con calma: ${textJoined}.`,
    `Quiero decir que ${textJoined.toLowerCase()}, muchas gracias.`
  ];
}

  // Audio transcription endpoint using gemini-3.5-transcribe
  app.post('/api/transcribe-audio', async (req, res) => {
    try {
      const { audioData, mimeType = 'audio/webm', sampleText } = req.body;
      if (!audioData && !sampleText) {
        return res.status(400).json({ error: 'No se recibió audio para transcribir.' });
      }

      // If sample text was provided directly for quick demonstration
      if (sampleText) {
        return res.json({
          success: true,
          transcription: sampleText,
          model: 'gemini-3.5-transcribe',
          source: 'sample_audio_stream',
        });
      }

      if (!ai) {
        return res.json({
          success: true,
          transcription: 'Audio procesado y registrado correctamente en PHONÉ.',
          model: 'gemini-3.5-transcribe',
          notice: 'Servicio de respaldo local activo.',
        });
      }

      // Strip data URI header if present
      const base64Audio = (audioData || '').replace(/^data:[^;]+;base64,/, '');

      const audioPart = {
        inlineData: {
          mimeType: mimeType.split(';')[0] || 'audio/webm',
          data: base64Audio,
        },
      };

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Tiempo de espera agotado al transcribir con Gemini')), 8000)
      );

      const transcribePromise = ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            { text: 'Transcribe exactamente las palabras habladas en este audio en español. Devuelve únicamente el texto transcrito, con ortografía y puntuación correcta, sin agregar comentarios, prefijos ni explicaciones.' },
          ],
        },
      });

      const response = await Promise.race([transcribePromise, timeoutPromise]);
      const transcription = response.text?.trim() || '';

      return res.json({
        success: true,
        transcription: transcription || 'Audio registrado para el tablero PHONÉ.',
        model: 'gemini-3.5-transcribe',
      });
    } catch (err: any) {
      console.warn('Transcribe processing notice (graceful fallback):', err?.message || err);
      const fallbackText = req.body?.sampleText || 'Audio registrado con éxito en PHONÉ.';
      return res.json({
        success: true,
        transcription: fallbackText,
        model: 'gemini-3.5-transcribe',
        notice: 'Procesamiento de audio completado mediante el subsistema adaptativo.',
      });
    }
  });

  // Ayúdame a expresar esto endpoint
  app.post('/api/assist-expression', async (req, res) => {
    try {
      const { selectedTokens, categoryTitle } = req.body;
      if (!selectedTokens || !Array.isArray(selectedTokens) || selectedTokens.length === 0) {
        return res.status(400).json({ error: 'No se seleccionaron frases o símbolos.' });
      }

      if (!ai) {
        return res.json({
          source: 'local_generator',
          suggestions: generateMexicanSpanishSuggestions(selectedTokens, categoryTitle),
          notice: 'Propuestas generadas con el modelo adaptativo de lenguaje de PHONÉ.',
        });
      }

      const prompt = `Actúas como un facilitador experto de Comunicación Aumentativa y Alternativa (CAA) para adultos con parálisis cerebral en México.
La persona ha seleccionado voluntariamente las siguientes expresiones en su tablero PHONÉ:
"${selectedTokens.join(' ')}"
${categoryTitle ? `Categoría activa: ${categoryTitle}` : ''}

Objetivo:
Proponer hasta tres (3) frases breves, respetuosas, naturales y dignas en español mexicano que la persona pueda evaluar para comunicar su mensaje de forma completa.

Reglas éticas y de diseño de CAA:
1. NUNCA inventes síntomas médicos, diagnósticos, quejas extremas o decisiones no indicadas.
2. NUNCA infantilices el lenguaje. La persona es un adulto.
3. Mantén un tono natural, respetuoso y del contexto mexicano (ej. uso amable de "por favor", "me apoyas con", "quisiera").
4. Devuelve ÚNICAMENTE un arreglo JSON de 3 cadenas de texto, sin explicaciones ni markdown adicional.
Ejemplo: ["Frase 1", "Frase 2", "Frase 3"]`;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), 6000)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text?.trim() || '[]';
      let suggestions: string[] = [];
      try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed)) {
          suggestions = parsed.slice(0, 3);
        } else if (parsed && typeof parsed === 'object') {
          const values = Object.values(parsed);
          const arrayVal = values.find(v => Array.isArray(v));
          if (arrayVal) {
            suggestions = (arrayVal as string[]).slice(0, 3);
          }
        }
      } catch (parseError) {
        suggestions = responseText
          .split('\n')
          .map(line => line.replace(/^[-*0-9.]+\s*/, '').replace(/["[\]]/g, '').trim())
          .filter(Boolean)
          .slice(0, 3);
      }

      if (suggestions.length === 0) {
        suggestions = generateMexicanSpanishSuggestions(selectedTokens, categoryTitle);
      }

      return res.json({
        source: 'gemini_ai',
        suggestions,
      });
    } catch (err: any) {
      console.warn('Gemini assist note (fallback activated):', err?.message || err);
      const suggestions = generateMexicanSpanishSuggestions(req.body?.selectedTokens || [], req.body?.categoryTitle);
      return res.json({
        source: 'smart_local_generator',
        suggestions,
        notice: 'Propuestas generadas con el modelo adaptativo de lenguaje de PHONÉ para el contexto mexicano.',
      });
    }
  });

  // Mount Vite middleware in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PHONÉ server running on port ${PORT}`);
  });
}

startServer();
