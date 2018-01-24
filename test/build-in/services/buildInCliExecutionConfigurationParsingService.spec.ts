import * as assert from 'assert';

import { IdentifiedStepOptionMaps } from 'continui-step';
import {
  CliExecutionConfigurationParsingService,
} from '../../../src/domain/cli/cliExecutionConfigurationParsingService';
import {
  BuildInCliExecutionConfigurationParsingService,
} from '../../../src/build-in/cli/buildIncliExecutionConfigurationParsingService';
import { ExecutionConfiguration } from '../../../src/domain/models/executionConfiguration';

describe('The Build In Cli Arguments Parsing Service', () => {
  it('Should parse and argument array into a execution configuration', () => {
    const cliArgumentsParsingService: CliExecutionConfigurationParsingService = 
        new BuildInCliExecutionConfigurationParsingService();
        
    const executionConfiguration: ExecutionConfiguration =  
        cliArgumentsParsingService.parse(['executor',
          'application',
          'testStep',
          '--testStep.param1',
          'value1',
          '--testStep.param2',
          'value2',
          'testParamerlessStep']);
    
    assert.ok(executionConfiguration.steps instanceof Array,
              'The steps option in main step must be an array');
    assert.ok(executionConfiguration.steps.indexOf('testStep') >= 0,
              'Can not find the step {step} in the step collection');
    assert.ok(executionConfiguration.steps.indexOf('testParamerlessStep') >= 0,
              'Can not find the step {step} in the step collection');
    assert.ok(executionConfiguration.stepsOptionsValues.testStep,
              'Can not find the option for the step {testStep}');
    assert.equal(executionConfiguration.stepsOptionsValues.testStep.param1, 'value1');
    assert.equal(executionConfiguration.stepsOptionsValues.testStep.param2, 'value2');
  });
});
