const config = {
    paths: ['tests/features/**/*.feature'],
    require: ['tests/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'summary',
      'progress-bar',
      'json:reports/cucumber_report.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
  };

module.exports = {
   default: config
}
