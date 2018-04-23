import { ActionOptionValueMap } from 'continui-action';

export interface ExecutionStep {
  key: string;
  actionIdentifier: string;
  actionOptionsValueMap?: ActionOptionValueMap;
}
