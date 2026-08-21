// Vercel Serverless Function: /api/recuperar
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  try {
    const { query } = req.body || {};
    if (!query) {
      return res.status(400).json({ error: 'Por favor ingresa tu ID de equipo o correo.' });
    }

    const cleanQuery = query.trim();
    const SUPABASE_URL = 'https://npvjuhpyqnfltedpxwze.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || Buffer.from('c2Jfc2VjcmV0X0RXUmJKbjZ6b0NMLVViNkRKZXFqeHdfYmNIUXdPMlg=', 'base64').toString('ascii');

    // Buscar por HWID o por usuario_zajuna (correo)
    let url = '';
    if (cleanQuery.toUpperCase().startsWith('AZ-') || /^[0-9]+$/.test(cleanQuery)) {
      const hwid = cleanQuery.toUpperCase().startsWith('AZ-') ? cleanQuery.toUpperCase() : 'AZ-' + cleanQuery;
      url = SUPABASE_URL + '/rest/v1/licencias_autozajuna?hwid=eq.' + encodeURIComponent(hwid) + '&activo=eq.true&select=*&order=fecha_expiracion.desc&limit=1';
    } else {
      url = SUPABASE_URL + '/rest/v1/licencias_autozajuna?usuario_zajuna=ilike.*' + encodeURIComponent(cleanQuery) + '*&activo=eq.true&select=*&order=fecha_expiracion.desc&limit=1';
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Error consultando base de datos' });
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontro ninguna licencia activa registrada con ese ID o correo.' });
    }

    const lic = data[0];
    const expDate = new Date(lic.fecha_expiracion);
    const now = new Date();
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return res.status(400).json({ error: 'Se encontro una licencia anterior pero ya se encuentra expirada.', token: lic.token });
    }

    return res.status(200).json({
      success: true,
      token: lic.token,
      hwid: lic.hwid,
      days_left: diffDays,
      expires_at: expDate.toLocaleDateString('es-CO')
    });

  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
