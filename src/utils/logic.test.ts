import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleSoftwareEngineer, initialApplications, initialOffers } from '../data/initialData';
import { analyzeJobMatch, injectSkillKeyword, extractResumeCorpus } from './atsEngine';
import {
  computeApplicationMetrics,
  advanceApplicationStage,
  calculateOfferTotalComp,
} from './applicationTracker';
import { generateAndroidProjectFiles } from './androidProjectBuilder';

test('ATS engine computes match score and detects missing keywords', () => {
  const jd = 'Looking for a Staff Engineer skilled in TypeScript, Kotlin, GraphQL, and Terraform on AWS.';
  const result = analyzeJobMatch(sampleSoftwareEngineer, jd);

  assert.equal(result.score > 50, true);
  assert.equal(result.matched.includes('typescript'), true);
  assert.equal(result.matched.includes('kotlin'), true);
  assert.equal(result.missing.includes('terraform'), true);
});

test('injectSkillKeyword adds missing keyword into resume skills and increases ATS match', () => {
  const jd = 'Requires deep experience in Terraform and Kubernetes.';
  const before = analyzeJobMatch(sampleSoftwareEngineer, jd);
  assert.equal(before.missing.includes('terraform'), true);

  const updated = injectSkillKeyword(sampleSoftwareEngineer, 'terraform');
  const corpus = extractResumeCorpus(updated);
  assert.equal(corpus.includes('terraform'), true);

  const after = analyzeJobMatch(updated, jd);
  assert.equal(after.matched.includes('terraform'), true);
  assert.equal(after.score >= before.score, true);
});

test('computeApplicationMetrics calculates pipeline totals and response rate', () => {
  const metrics = computeApplicationMetrics(initialApplications);
  assert.equal(metrics.total, 4);
  assert.equal(metrics.byStage.interviewing, 1);
  assert.equal(metrics.byStage.offer, 1);
  assert.equal(metrics.activeCount, 3);
  assert.equal(metrics.responseRatePct, 67);
});

test('advanceApplicationStage cycles through job application stages', () => {
  assert.equal(advanceApplicationStage('saved'), 'applied');
  assert.equal(advanceApplicationStage('applied'), 'interviewing');
  assert.equal(advanceApplicationStage('interviewing'), 'offer');
  assert.equal(advanceApplicationStage('offer'), 'archived');
  assert.equal(advanceApplicationStage('archived'), 'saved');
});

test('calculateOfferTotalComp computes recurring and year-1 compensation accurately', () => {
  const comp = calculateOfferTotalComp(initialOffers[0]);
  // Base 245,000 + 15% bonus (36,750) + 95,000 equity = 376,750 recurring; + 35,000 signing = 411,750 year 1
  assert.equal(comp.bonusAmount, 36750);
  assert.equal(comp.recurringAnnual, 376750);
  assert.equal(comp.year1Total, 411750);
});

test('generateAndroidProjectFiles produces valid AndroidManifest.xml and MainActivity.kt', () => {
  const files = generateAndroidProjectFiles({
    appName: 'Reactive Resume',
    applicationId: 'me.rxresu.android',
    versionName: '6.0.0',
    versionCode: 60,
    webAppUrl: 'https://rxresu.me',
    themeColorHex: '#0f172a',
    enableOfflineCache: true,
    enableBiometricLock: false,
  });

  assert.equal(Boolean(files['app/src/main/AndroidManifest.xml']), true);
  assert.equal(
    files['app/src/main/AndroidManifest.xml'].includes('package') ||
      files['app/build.gradle.kts'].includes('namespace = "me.rxresu.android"'),
    true
  );
  assert.equal(
    files['app/src/main/java/me/rxresu/android/MainActivity.kt'].includes('class MainActivity : Activity()'),
    true
  );
});
