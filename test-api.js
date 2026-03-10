/**
 * Test script to verify key generation API
 */

async function testKeyGeneration() {
  try {
    console.log('Testing key generation API...');

    // Test generate-key endpoint
    const generateResponse = await fetch('http://localhost:3000/api/generate-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: 'Test Key',
        createdBy: 'admin'
      })
    });

    const generateResult = await generateResponse.json();
    console.log('Generate key result:', generateResult);

    if (generateResult.success && generateResult.code) {
      console.log('✅ Key generation successful!');

      // Test validation endpoint
      const validateResponse = await fetch('http://localhost:3000/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: generateResult.code
        })
      });

      const validateResult = await validateResponse.json();
      console.log('Validate key result:', validateResult);

      if (validateResult.valid) {
        console.log('✅ Key validation successful!');
      } else {
        console.log('❌ Key validation failed');
      }
    } else {
      console.log('❌ Key generation failed');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testKeyGeneration();