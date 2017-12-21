import * as assert from 'assert';
import { CliArgumentsParsingService } from '../../src/services/cliArgumentsParsingService';
import { BuildInCliArgumentsParsingService } from 
    '../../src/build-in/services/buildInCliArgumentsParsingService';
import { IdentifiedStepOptionMaps } from '../../src/types';

describe('The Build In Cli Arguments Parsing Service', () => {
  it('Should parse and argument array into a identified step option map', () => {
    const cliArgumentsParsingService: CliArgumentsParsingService = 
        new BuildInCliArgumentsParsingService();
        
    const identifiedStepOptionMaps: IdentifiedStepOptionMaps =  
        cliArgumentsParsingService.parse(['executor',
          'application',
          'step',
          '--step.param1',
          'value1',
          '--step.param2',
          'value2',
          'paramerlessStep']);

    assert.ok(identifiedStepOptionMaps.main, 'The parser doesn\'t create the main step');
    assert.ok(identifiedStepOptionMaps.main.steps instanceof Array,
              'The steps option in main step must be an array');
    assert.ok(identifiedStepOptionMaps.main.steps.indexOf('step') >= 0,
              'Can not find the step {step} in the step collection');
    assert.ok(identifiedStepOptionMaps.main.steps.indexOf('paramerlessStep') >= 0,
              'Can not find the step {step} in the step collection');
    assert.ok(identifiedStepOptionMaps.step,
              'Can not find the option for the step {step}');
    assert.equal(identifiedStepOptionMaps.step.param1, 'value1');
    assert.equal(identifiedStepOptionMaps.step.param2, 'value2');
  });
});
