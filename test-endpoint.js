
async function test() {
  try {
    console.log('Testing endpoint...');
    const response = await fetch('http://localhost:3000/api/proxy/n8n/chart-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    
    const text = await response.text();
    console.log('Body length:', text.length);
    console.log('Body preview:', text.substring(0, 200));
    
    try {
      JSON.parse(text);
      console.log('Body is valid JSON');
    } catch (e) {
      console.error('Body is NOT valid JSON');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

test();
