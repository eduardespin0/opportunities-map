import fs from 'fs';

async function testUpload() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'tunuevacontraseña' })
  });
  
  const cookieStr = loginRes.headers.get('set-cookie');

  console.log('Sending upload request...');
  const fileBuffer = fs.readFileSync('public/icon.png');
  const blob = new Blob([fileBuffer], { type: 'image/png' });
  const form = new FormData();
  form.append('file', blob, 'icon.png');

  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: { 'cookie': cookieStr },
    body: form,
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

testUpload().catch(console.error);

