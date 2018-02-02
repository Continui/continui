import * as assert from 'assert';

import { IdentifiedActionOptionMaps } from 'continui-action';
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
          'testAction',
          '--testAction.param1',
          'value1',
          '--testAction.param2',
          'value2',
          'testParamerlessAction']);
    
    assert.ok(executionConfiguration.actions instanceof Array,
              'The actions option in main action must be an array');
    assert.ok(executionConfiguration.actions.indexOf('testAction') >= 0,
              'Can not find the action {action} in the action collection');
    assert.ok(executionConfiguration.actions.indexOf('testParamerlessAction') >= 0,
              'Can not find the action {action} in the action collection');
    assert.ok(executionConfiguration.actionsOptionsValues.testAction,
              'Can not find the option for the action {testAction}');
    assert.equal(executionConfiguration.actionsOptionsValues.testAction.param1, 'value1');
    assert.equal(executionConfiguration.actionsOptionsValues.testAction.param2, 'value2');
  });
});
