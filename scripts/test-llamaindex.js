/**
 * Test script for LlamaIndex integration
 * Run this after setting up your environment to verify everything works
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4321/api';

async function testApiEndpoint(name, url, options = {}) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ ${name}: FAILED`);
      console.log('Error:', data);
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting LlamaIndex Integration Tests\n');
  console.log('Make sure your development server is running: npm run dev');
  console.log('Ensure you have configured your .env file with API keys\n');

  // Test 1: Check if server is running
  await testApiEndpoint('Server Health', 'http://localhost:4321/');

  // Test 2: Check current documents
  await testApiEndpoint('Get Documents List', `${API_BASE}/manage-index`);

  // Test 3: Initialize index
  await testApiEndpoint('Initialize Index', `${API_BASE}/manage-index`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'initialize' })
  });

  // Test 4: Search functionality (this will likely fail if no documents are indexed)
  await testApiEndpoint('Search Test', `${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'council decisions',
      topK: 5
    })
  });

  // Test 5: Test document indexing (with sample content)
  await testApiEndpoint('Index Test Document', `${API_BASE}/index-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'This is a sample parish council document about village maintenance and planning decisions.',
      title: 'Test Document',
      type: 'policy',
      metadata: { date: '2025-01-01', path: '/test/document.pdf' }
    })
  });

  // Test 6: Search after indexing
  await testApiEndpoint('Search After Indexing', `${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'village maintenance planning decisions',
      topK: 5
    })
  });

  console.log('\n🎯 Test Summary:');
  console.log('- If server health fails, make sure your dev server is running');
  console.log('- If search fails, check your API keys and document indexing');
  console.log('- Document indexing should work with proper API configuration');
  console.log('\n📚 Next Steps:');
  console.log('1. Configure your .env file with API keys');
  console.log('2. Run: npm install');
  console.log('3. Start dev server: npm run dev');
  console.log('4. Visit: http://localhost:4321/search');
  console.log('\n📖 See docs/LLAMAINDEX_INTEGRATION.md for detailed setup instructions');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };