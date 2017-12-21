import * as assert from 'assert';
import { BuildInTextSecureService } from '../../src/build-in/services/buidInTextSecureService';

describe('The Build In Text Secure Service', () => {
  it('Should replace all text registered as sensitive for "[secure]"', () => {
    const buildInTextSecureService: BuildInTextSecureService = new BuildInTextSecureService();

    buildInTextSecureService.registerSersitiveText('-a-');
    buildInTextSecureService.registerSersitiveText('-e-');

    assert.equal(buildInTextSecureService.tranform(
                 '-a- can\'t get displayed as well the -e-.'),
                 '[secure] can\'t get displayed as well the [secure].');
  });
});
