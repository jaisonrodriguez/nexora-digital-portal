// Vercel Serverless Function: /api/activar
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
    const { hwid, email, transactionId, plan } = req.body || {};

    if (!hwid) {
      return res.status(400).json({ error: 'Falta el ID de maquina (HWID).' });
    }

    const SUPABASE_URL = 'https://npvjuhpyqnfltedpxwze.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || Buffer.from('c2Jfc2VjcmV0X0RXUmJKbjZ6b0NMLVViNkRKZXFqeHdfYmNIUXdPMlg=', 'base64').toString('ascii');

    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30);

    const randomPart1 = Math.random().toString(16).substring(2, 10).toUpperCase();
    const randomPart2 = Math.random().toString(16).substring(2, 6).toUpperCase();
    const token = 'AZ-' + randomPart1 + '-' + randomPart2;

    const response = await fetch(SUPABASE_URL + '/rest/v1/licencias_autozajuna', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        token: token,
        fecha_expiracion: expDate.toISOString(),
        activo: true,
        hwid: hwid,
        usuario_zajuna: (email || 'Cliente Nexora') + ' [Wompi: ' + (transactionId || 'Aprobado') + ' | Plan: ' + (plan || 'PRO').toUpperCase() + ']'
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(500).json({ error: 'Error registrando en base de datos', details: errBody });
    }

    return res.status(200).json({
      success: true,
      token: token,
      hwid: hwid,
      plan: plan || 'PRO'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
