// Quick API verification script
const http = require('http');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: url,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, res => {
      let str = '';
      res.on('data', d => str += d);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(str) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n=== Testing Monika\'s Creation MERN API ===\n');

  // Test 1: Admin login
  try {
    const r1 = await post('/api/users/login', { email: 'admin@monikascreation.com', password: 'admin123' });
    console.log('✅ Admin Login:', r1.status === 200 ? 'PASSED' : 'FAILED', `(${r1.status})`);
    if (r1.body.token) console.log('   Token generated:', r1.body.token.substring(0, 30) + '...');
    if (!r1.body._id && r1.body.message) console.log('   Error:', r1.body.message);
  } catch (e) { console.log('❌ Admin Login: ERROR -', e.message); }

  // Test 2: Owner login
  try {
    const r2 = await post('/api/users/login', { email: 'sethswayam21@gmail.com', password: 'Monik@6306' });
    console.log('✅ Owner Login:', r2.status === 200 ? 'PASSED' : 'FAILED', `(${r2.status})`);
    if (r2.body.isAdmin) console.log('   isAdmin: true ✓');
  } catch (e) { console.log('❌ Owner Login: ERROR -', e.message); }

  // Test 3: Send OTP
  try {
    const r3 = await post('/api/users/send-otp', { phone: '9876543210' });
    console.log('✅ Send OTP:', r3.status === 200 ? 'PASSED' : 'FAILED', `(${r3.status})`);
    if (r3.body.demoOtp) console.log('   Demo OTP:', r3.body.demoOtp);
  } catch (e) { console.log('❌ Send OTP: ERROR -', e.message); }

  // Test 4: Coupon validation
  try {
    const r4 = await post('/api/coupons/validate', { code: 'WELCOME10', subtotal: 5000 });
    console.log('✅ Coupon Validate:', r4.status === 200 ? 'PASSED' : 'FAILED', `(${r4.status})`);
    if (r4.body.discountAmount) console.log('   Discount Amount: ₹' + r4.body.discountAmount);
  } catch (e) { console.log('❌ Coupon Validate: ERROR -', e.message); }

  console.log('\n=== All tests complete ===\n');
}

main();
