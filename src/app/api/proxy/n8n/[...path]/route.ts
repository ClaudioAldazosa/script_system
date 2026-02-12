import { NextRequest, NextResponse } from 'next/server';

// Definir la URL base una sola vez
const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.aldazosa-n8n.xyz/webhook';

/**
 * Función centralizada para manejar el proxy
 */
async function handleProxy(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>
) {
  const { path } = await paramsPromise;
  const pathString = path.join('/');

  // 1. Incluir Query Parameters (ej. ?orderId=123)
  const searchParams = request.nextUrl.search;
  const targetUrl = `${N8N_BASE_URL}/${pathString}${searchParams}`;

  console.log(`[Proxy] ${request.method} request to: ${targetUrl}`);

  try {
    // 2. Preparar opciones del fetch
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        // Puedes agregar aquí headers de autenticación si n8n los requiere
        // 'Authorization': request.headers.get('Authorization') || '',
      },
    };

    // 3. Manejo del Body (solo si NO es GET/HEAD)
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        // Leemos el body con otro nombre para evitar conflicto de variables
        const requestBody = await request.json();
        console.log('[Proxy] Request body payload:', JSON.stringify(requestBody, null, 2));
        fetchOptions.body = JSON.stringify(requestBody);
      } catch (e) {
        console.warn('[Proxy] Warning: Could not parse request body as JSON or body is empty');
      }
    }

    // 4. Realizar la petición a n8n
    const response = await fetch(targetUrl, fetchOptions);
    console.log(`[Proxy] n8n response status: ${response.status}`);

    // 5. Manejo de Errores de n8n (Status 4xx/5xx)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Proxy] n8n error response:`, errorText);
      
      // Intentar devolver JSON si es posible, sino texto plano
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: response.status });
      } catch {
        return new NextResponse(errorText, { 
          status: response.status,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }

    // 6. Devolver respuesta exitosa (Streaming)
    // Usamos el stream original para eficiencia y mantenemos los headers originales
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });

  } catch (error: any) {
    console.error('[Proxy] Internal Server Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error in Proxy', 
        message: error.message,
        path: pathString
      },
      { status: 500 }
    );
  }
}

// Exportar manejadores para los métodos HTTP soportados
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, params);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, params);
}

// Puedes agregar PUT, DELETE, PATCH fácilmente exportando la misma función
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, params);
}