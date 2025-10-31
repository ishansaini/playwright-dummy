const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

// Read the cucumber report JSON
const reportPath = path.join(__dirname, 'reports', 'cucumber_report.json');

if (!fs.existsSync(reportPath)) {
  console.error('Cucumber report not found at:', reportPath);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Parse the report and generate summary
let totalScenarios = 0;
let passedScenarios = 0;
let failedScenarios = 0;
let skippedScenarios = 0;
let totalSteps = 0;
let passedSteps = 0;
let failedSteps = 0;
let skippedSteps = 0;

const featureResults = [];

report.forEach(feature => {
  let featurePassed = 0;
  let featureFailed = 0;
  let featureSkipped = 0;
  
  feature.elements?.forEach(scenario => {
    totalScenarios++;
    
    let scenarioStatus = 'passed';
    let scenarioSteps = [];
    
    scenario.steps?.forEach(step => {
      totalSteps++;
      
      if (step.result.status === 'passed') {
        passedSteps++;
      } else if (step.result.status === 'failed') {
        failedSteps++;
        scenarioStatus = 'failed';
      } else if (step.result.status === 'skipped' || step.result.status === 'undefined') {
        skippedSteps++;
        if (scenarioStatus !== 'failed') {
          scenarioStatus = 'skipped';
        }
      }
      
      scenarioSteps.push({
        name: step.name,
        status: step.result.status,
        duration: step.result.duration || 0
      });
    });
    
    if (scenarioStatus === 'passed') {
      passedScenarios++;
      featurePassed++;
    } else if (scenarioStatus === 'failed') {
      failedScenarios++;
      featureFailed++;
    } else {
      skippedScenarios++;
      featureSkipped++;
    }
  });
  
  featureResults.push({
    name: feature.name,
    passed: featurePassed,
    failed: featureFailed,
    skipped: featureSkipped
  });
});

// Generate markdown summary
let summary = '## 🎭 Playwright Test Results\n\n';

// Overall statistics
summary += '### 📊 Summary\n\n';
summary += '| Metric | Count |\n';
summary += '|--------|-------|\n';
summary += `| Total Scenarios | ${totalScenarios} |\n`;
summary += `| ✅ Passed | ${passedScenarios} |\n`;
summary += `| ❌ Failed | ${failedScenarios} |\n`;
summary += `| ⏭️ Skipped | ${skippedScenarios} |\n`;
summary += `| Total Steps | ${totalSteps} |\n`;
summary += `| Step Success Rate | ${totalSteps > 0 ? Math.round((passedSteps / totalSteps) * 100) : 0}% |\n`;
summary += '\n';

// Feature breakdown
if (featureResults.length > 0) {
  summary += '### 📋 Feature Results\n\n';
  summary += '| Feature | Passed | Failed | Skipped |\n';
  summary += '|---------|--------|--------|----------|\n';
  
  featureResults.forEach(feature => {
    const statusIcon = feature.failed > 0 ? '❌' : feature.passed > 0 ? '✅' : '⏭️';
    summary += `| ${statusIcon} ${feature.name} | ${feature.passed} | ${feature.failed} | ${feature.skipped} |\n`;
  });
  summary += '\n';
}

// Overall status
if (failedScenarios > 0) {
  summary += '### ❌ Test Run Failed\n\n';
  summary += `${failedScenarios} scenario(s) failed out of ${totalScenarios} total.\n`;
} else if (passedScenarios === totalScenarios && totalScenarios > 0) {
  summary += '### ✅ All Tests Passed!\n\n';
  summary += `All ${totalScenarios} scenarios passed successfully! 🎉\n`;
} else {
  summary += '### ⚠️ Test Run Completed with Warnings\n\n';
  summary += `${passedScenarios} passed, ${skippedScenarios} skipped out of ${totalScenarios} total.\n`;
}

// Write to GitHub Step Summary if available
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  console.log('✅ Job summary written to GitHub Actions');
} else {
  console.log('ℹ️ Not running in GitHub Actions, summary output:');
  console.log(summary);
}

// Also output to console for visibility
console.log('\n' + summary);
