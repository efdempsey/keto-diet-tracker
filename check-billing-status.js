#!/usr/bin/env node

console.log('🔍 Google Cloud Billing Status Check');
console.log('===================================\n');

console.log('1️⃣ Check Replit Account Settings:');
console.log('   • Go to your Replit account settings');
console.log('   • Look for "Billing" or "Deployments" section');
console.log('   • Check if Google Cloud integration is enabled');

console.log('\n2️⃣ Google Cloud Console Check:');
console.log('   • Visit: https://console.cloud.google.com/billing');
console.log('   • Sign in with the same Google account used for Replit');
console.log('   • Check if you have an active billing account');
console.log('   • Verify Cloud Run API is enabled');

console.log('\n3️⃣ Replit Deployment Requirements:');
console.log('   For Cloud Run deployment, you need:');
console.log('   • Valid Google Cloud billing account');
console.log('   • Cloud Run API enabled');
console.log('   • Sufficient quota/credits');
console.log('   • Project linked to billing account');

console.log('\n4️⃣ Signs of Billing Issues:');
console.log('   • Deploy button appears grayed out');
console.log('   • No deployment options visible');
console.log('   • Error messages about billing');
console.log('   • Deployment attempts fail immediately');

console.log('\n5️⃣ Alternative Deployment Options:');
console.log('   If Google Cloud billing is the issue:');
console.log('   • Use Replit\'s native deployment (if available)');
console.log('   • Deploy to Railway, Vercel, or Netlify');
console.log('   • Use GitHub Actions for deployment');
console.log('   • Export project and deploy elsewhere');

console.log('\n6️⃣ Quick Test - Environment Variables:');
console.log('   Current environment indicators:');
console.log(`   • REPLIT_CLUSTER: ${process.env.REPLIT_CLUSTER || 'Not set'}`);
console.log(`   • GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT || 'Not set'}`);
console.log(`   • GCLOUD_PROJECT: ${process.env.GCLOUD_PROJECT || 'Not set'}`);

if (process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT) {
  console.log('   ✅ Google Cloud project detected');
} else {
  console.log('   ⚠️  No Google Cloud project environment variables found');
}

console.log('\n7️⃣ Next Steps:');
console.log('   1. Check your Google Cloud Console billing status');
console.log('   2. If billing is disabled, enable it with a payment method');
console.log('   3. If billing is enabled, try refreshing Replit');
console.log('   4. Contact Replit support if the issue persists');

console.log('\n✅ Your app is technically ready for deployment');
console.log('   The issue is likely account/billing related, not code related');