import * as assert from 'assert';

import { IdentifiedActionOptionMaps } from 'continui-action';
import {
  CliExecutionConfigurationParsingService,
} from '../../../src/domain/cli/cliExecutionConfigurationParsingService';
import {
  BuildInCliExecutionConfigurationParsingService,
} from '../../../src/build-in/cli/buildIncliExecutionConfigurationParsingService';
import { ExecutionConfiguration } from '../../../src/domain/models/executionConfiguration';
import { sep } from 'path';

describe('The Build In Cli Arguments Parsing Service', () => {
  it('Should parse and argument array into a execution configuration', () => {
    const cliArgumentsParsingService: CliExecutionConfigurationParsingService = 
        new BuildInCliExecutionConfigurationParsingService();
        
    const executionConfiguration: ExecutionConfiguration =  
        cliArgumentsParsingService.parse(['executor',
          'application',
          '--step.testAction.run',
          '--step.testAction.param1',
          'value1',
          '--step.testAction.param2',
          'value2',
          '--step.testParamerlessAction.run']);
    /*
    assert.ok(executionConfiguration.steps instanceof Array,
              'The steps option in main action must be an array');
    assert.ok(executionConfiguration.steps.map(step => step.key).indexOf('testAction') >= 0,
              'Can not find the step {step} in the step collection');
    assert.ok(executionConfiguration.steps
                                    .map(step => step.key).indexOf('testParamerlessAction') >= 0,
              'Can not find the step {step} in the step collection');
    assert.ok(executionConfiguration.actionsOptionsValues.testAction,
              'Can not find the option for the action {testAction}');
    assert.equal(executionConfiguration.actionsOptionsValues.testAction.param1, 'value1');
    assert.equal(executionConfiguration.actionsOptionsValues.testAction.param2, 'value2');
    */
  });
});
