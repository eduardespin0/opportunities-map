import { NextResponse } from 'next/server';

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || 'fb03f1b10a6cabfd78b93efc09b8ef19';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo.' },
        { status: 400 }
      );
    }

    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen válida (PNG, JPG, WEBP, etc.).' },
        { status: 400 }
      );
    }

    // Enviar directamente a la API de ImgBB sin escribir en el sistema de archivos local
    const imgbbForm = new FormData();
    imgbbForm.append('image', file, file.name);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const imgbbRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: imgbbForm,
    });

    const data = await imgbbRes.json();

    if (!imgbbRes.ok || !data?.success) {
      const errorMsg = data?.error?.message || 'Error desconocido al subir a ImgBB.';
      console.error('Error devuelto por ImgBB:', data);
      return NextResponse.json(
        { error: `Error en ImgBB: ${errorMsg}` },
        { status: 502 }
      );
    }

    // Obtener la URL directa original de máxima calidad (evitando la versión comprimida 'display_url')
    const directImageUrl = data.data.image?.url || data.data.url || data.data.display_url;

    return NextResponse.json({
      success: true,
      url: directImageUrl,
      filename: file.name,
      source: 'imgbb',
    });
  } catch (error: any) {
    console.error('Error general en /api/upload:', error);
    return NextResponse.json(
      { error: 'Error del servidor al procesar la imagen: ' + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
