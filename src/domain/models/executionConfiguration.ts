import { IdentifiedActionOptionMaps } from 'continui-action';

export interface ExecutionConfiguration {
  actions: string[];
  actionsDeinitionsModules?: string[];
  actionsOptionsValues?: IdentifiedActionOptionMaps;
  cofigurationFile?: string;
}
